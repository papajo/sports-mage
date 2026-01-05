/**
 * The Odds API Integration
 * Documentation: https://the-odds-api.com/liveapi/guides/v4/
 */

export interface OddsApiResponse {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface Market {
  key: string; // 'h2h', 'spreads', 'totals', etc.
  last_update: string;
  outcomes: Outcome[];
}

export interface Outcome {
  name: string;
  price: number; // American odds format
  point?: number; // For spreads and totals
}

export interface TransformedOdds {
  id: string;
  sport_key: string;
  sport_title: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  bookmakers: {
    [bookmakerKey: string]: {
      name: string;
      moneyline?: {
        home: number;
        away: number;
        draw?: number;
      };
      spread?: {
        home: number;
        away: number;
        line: number;
      };
      total?: {
        over: number;
        under: number;
        line: number;
      };
      last_update: string;
    };
  };
  best_odds: {
    moneyline?: {
      home: { odds: number; bookmaker: string };
      away: { odds: number; bookmaker: string };
      draw?: { odds: number; bookmaker: string };
    };
    spread?: {
      home: { odds: number; bookmaker: string; line: number };
      away: { odds: number; bookmaker: string; line: number };
    };
    total?: {
      over: { odds: number; bookmaker: string; line: number };
      under: { odds: number; bookmaker: string; line: number };
    };
  };
  last_updated: string;
}

/**
 * Fetch odds from The Odds API
 */
export async function fetchOddsFromAPI(
  sport: string = 'soccer',
  regions: string[] = ['us'],
  markets: string[] = ['h2h', 'spreads', 'totals']
): Promise<OddsApiResponse[]> {
  const apiKey = process.env.ODDS_API_KEY;
  
  if (!apiKey) {
    throw new Error('ODDS_API_KEY environment variable is not set');
  }

  const regionsParam = regions.join(',');
  const marketsParam = markets.join(',');
  
  const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=${regionsParam}&markets=${marketsParam}&oddsFormat=american`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 30 } // Cache for 30 seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`The Odds API error: ${response.status} - ${errorText}`);
    }

    const data: OddsApiResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching odds from The Odds API:', error);
    throw error;
  }
}

/**
 * Transform The Odds API response to our internal format
 */
export function transformOddsApiResponse(apiOdds: OddsApiResponse[]): TransformedOdds[] {
  return apiOdds.map((game) => {
    const bookmakersMap: TransformedOdds['bookmakers'] = {};
    const bestOdds: TransformedOdds['best_odds'] = {};

    // Process each bookmaker
    game.bookmakers.forEach((bookmaker) => {
      const bookmakerData: any = {
        name: bookmaker.title,
        last_update: bookmaker.last_update,
      };

      // Process markets
      bookmaker.markets.forEach((market) => {
        if (market.key === 'h2h') {
          // Moneyline
          const homeOutcome = market.outcomes.find((o) => 
            o.name === game.home_team || o.name.includes(game.home_team.split(' ')[0])
          );
          const awayOutcome = market.outcomes.find((o) => 
            o.name === game.away_team || o.name.includes(game.away_team.split(' ')[0])
          );
          const drawOutcome = market.outcomes.find((o) => 
            o.name.toLowerCase().includes('draw') || o.name.toLowerCase().includes('tie')
          );

          if (homeOutcome && awayOutcome) {
            bookmakerData.moneyline = {
              home: homeOutcome.price,
              away: awayOutcome.price,
              ...(drawOutcome && { draw: drawOutcome.price }),
            };

            // Track best odds
            if (!bestOdds.moneyline) {
              bestOdds.moneyline = {
                home: { odds: homeOutcome.price, bookmaker: bookmaker.title },
                away: { odds: awayOutcome.price, bookmaker: bookmaker.title },
                ...(drawOutcome && {
                  draw: { odds: drawOutcome.price, bookmaker: bookmaker.title },
                }),
              };
            } else {
              // Update if better odds found
              if (homeOutcome.price > bestOdds.moneyline.home.odds) {
                bestOdds.moneyline.home = { odds: homeOutcome.price, bookmaker: bookmaker.title };
              }
              if (awayOutcome.price > bestOdds.moneyline.away.odds) {
                bestOdds.moneyline.away = { odds: awayOutcome.price, bookmaker: bookmaker.title };
              }
              if (drawOutcome && bestOdds.moneyline.draw) {
                if (drawOutcome.price > bestOdds.moneyline.draw.odds) {
                  bestOdds.moneyline.draw = { odds: drawOutcome.price, bookmaker: bookmaker.title };
                }
              }
            }
          }
        } else if (market.key === 'spreads') {
          // Spread
          const homeOutcome = market.outcomes.find((o) => 
            o.name === game.home_team || o.name.includes(game.home_team.split(' ')[0])
          );
          const awayOutcome = market.outcomes.find((o) => 
            o.name === game.away_team || o.name.includes(game.away_team.split(' ')[0])
          );

          if (homeOutcome && awayOutcome && homeOutcome.point !== undefined) {
            bookmakerData.spread = {
              home: homeOutcome.price,
              away: awayOutcome.price,
              line: Math.abs(homeOutcome.point),
            };

            // Track best odds
            if (!bestOdds.spread) {
              bestOdds.spread = {
                home: { odds: homeOutcome.price, bookmaker: bookmaker.title, line: Math.abs(homeOutcome.point) },
                away: { odds: awayOutcome.price, bookmaker: bookmaker.title, line: Math.abs(homeOutcome.point) },
              };
            } else {
              if (homeOutcome.price > bestOdds.spread.home.odds) {
                bestOdds.spread.home = { odds: homeOutcome.price, bookmaker: bookmaker.title, line: Math.abs(homeOutcome.point) };
              }
              if (awayOutcome.price > bestOdds.spread.away.odds) {
                bestOdds.spread.away = { odds: awayOutcome.price, bookmaker: bookmaker.title, line: Math.abs(homeOutcome.point) };
              }
            }
          }
        } else if (market.key === 'totals') {
          // Totals (Over/Under)
          const overOutcome = market.outcomes.find((o) => 
            o.name.toLowerCase().includes('over')
          );
          const underOutcome = market.outcomes.find((o) => 
            o.name.toLowerCase().includes('under')
          );

          if (overOutcome && underOutcome && overOutcome.point !== undefined) {
            bookmakerData.total = {
              over: overOutcome.price,
              under: underOutcome.price,
              line: overOutcome.point,
            };

            // Track best odds
            if (!bestOdds.total) {
              bestOdds.total = {
                over: { odds: overOutcome.price, bookmaker: bookmaker.title, line: overOutcome.point },
                under: { odds: underOutcome.price, bookmaker: bookmaker.title, line: overOutcome.point },
              };
            } else {
              if (overOutcome.price > bestOdds.total.over.odds) {
                bestOdds.total.over = { odds: overOutcome.price, bookmaker: bookmaker.title, line: overOutcome.point };
              }
              if (underOutcome.price > bestOdds.total.under.odds) {
                bestOdds.total.under = { odds: underOutcome.price, bookmaker: bookmaker.title, line: overOutcome.point };
              }
            }
          }
        }
      });

      bookmakersMap[bookmaker.key] = bookmakerData;
    });

    return {
      id: game.id,
      sport_key: game.sport_key,
      sport_title: game.sport_title,
      home_team: game.home_team,
      away_team: game.away_team,
      commence_time: game.commence_time,
      bookmakers: bookmakersMap,
      best_odds: bestOdds,
      last_updated: new Date().toISOString(),
    };
  });
}

/**
 * Get available sports from The Odds API
 */
export async function getAvailableSports(): Promise<Array<{ key: string; title: string; active: boolean }>> {
  const apiKey = process.env.ODDS_API_KEY;
  
  if (!apiKey) {
    throw new Error('ODDS_API_KEY environment variable is not set');
  }

  try {
    const response = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${apiKey}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sports: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching sports from The Odds API:', error);
    throw error;
  }
}

