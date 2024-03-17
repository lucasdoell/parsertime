import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CardIcon from "@/components/ui/card-icon";
import {
  calculateXFactor,
  getAverageTimeToUseUlt,
  getAverageUltChargeTime,
  getDuelWinrates,
  getKillsPerUltimate,
} from "@/lib/analytics";
import {
  cn,
  groupPlayerKillsIntoFights,
  toHero,
  toTimestamp,
} from "@/lib/utils";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { KillfeedTable } from "@/components/map/killfeed-table";

export async function PlayerAnalytics({
  id,
  playerName,
}: {
  id: number;
  playerName: string;
}) {
  const averageTimeToUltimate = await getAverageUltChargeTime(id, playerName);
  const averageTimeToUseUlt = await getAverageTimeToUseUlt(id, playerName);
  const killsPerUltimate = await getKillsPerUltimate(id, playerName);

  const duels = await getDuelWinrates(id, playerName);

  const match = await prisma.matchStart.findFirst({
    where: {
      MapDataId: id,
    },
  });

  const fights = await groupPlayerKillsIntoFights(id, playerName);

  const xFactor = await calculateXFactor(id, playerName);

  return (
    <main className="min-h-[65vh]">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Ultimate Charge Time
            </CardTitle>
            <CardIcon>
              <line x1="10" x2="14" y1="2" y2="2" />
              <line x1="12" x2="15" y1="14" y2="11" />
              <circle cx="12" cy="14" r="8" />
            </CardIcon>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toTimestamp(averageTimeToUltimate)}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              The average time it takes to build an ultimate.
            </p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Time to Use Ultimate
            </CardTitle>
            <CardIcon>
              <path d="M5 22h14" />
              <path d="M5 2h14" />
              <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
              <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
            </CardIcon>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toTimestamp(averageTimeToUseUlt)}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              The average time it takes to use an ultimate after it&apos;s
              charged.
            </p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Number of Final Blows Per Ultimate
            </CardTitle>
            <CardIcon>
              <circle cx="12" cy="12" r="10" />
              <line x1="22" x2="18" y1="12" y2="12" />
              <line x1="6" x2="2" y1="12" y2="12" />
              <line x1="12" x2="12" y1="6" y2="2" />
              <line x1="12" x2="12" y1="22" y2="18" />
            </CardIcon>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {killsPerUltimate.toFixed(2)}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              The average number of{" "}
              <span className="font-bold">final blows</span> a player gets with
              their ultimate. Note that for some heroes, the ultimate ability
              itself may not result in a kill.
            </p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">X Factor</CardTitle>
            <CardIcon>
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              <path d="M5 3v4" />
              <path d="M19 17v4" />
              <path d="M3 5h4" />
              <path d="M17 19h4" />
            </CardIcon>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{xFactor.toFixed(2)}</div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              The X Factor is a measure of a player&apos;s individual impact on
              a fight. If your X Factor is high, you are likely to be the
              deciding factor in a fight. Please note that this is calculated
              differently for each role.
            </p>
          </CardFooter>
        </Card>
        <Card className="col-span-full 2xl:col-span-1 max-h-[80vh] overflow-y-auto">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Versus Other Players
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {playerName}&apos;s score and winrates against players on the
              enemy team.
            </p>
          </CardHeader>
          <CardContent>
            {duels.map((duel) => (
              <div key={duel.enemy_name} className="pb-4">
                <div
                  key={duel.player_name}
                  className="flex items-center space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <Image
                      src={`/heroes/${toHero(duel.player_hero)}.png`}
                      alt=""
                      width={256}
                      height={256}
                      className={cn(
                        "h-12 w-12 border-2 rounded",
                        duel.player_team === match?.team_1_name
                          ? "border-blue-500"
                          : "border-red-500"
                      )}
                    />
                    <div className="text-lg font-medium">
                      {duel.player_name}
                    </div>
                    <div className="text-lg font-medium">&rarr;</div>
                    <Image
                      src={`/heroes/${toHero(duel.enemy_hero)}.png`}
                      alt=""
                      width={256}
                      height={256}
                      className={cn(
                        "h-12 w-12 border-2 rounded",
                        duel.enemy_team === match?.team_1_name
                          ? "border-blue-500"
                          : "border-red-500"
                      )}
                    />
                    <div className="text-lg font-medium">{duel.enemy_name}</div>
                  </div>
                </div>
                <div className="text-lg align-middle">
                  Score:{" "}
                  <span
                    className={cn(
                      duel.player_team === match?.team_1_name
                        ? "text-blue-500"
                        : "text-red-500"
                    )}
                  >
                    {duel.enemy_deaths}
                  </span>{" "}
                  -{" "}
                  <span
                    className={cn(
                      duel.enemy_team === match?.team_1_name
                        ? "text-blue-500"
                        : "text-red-500"
                    )}
                  >
                    {duel.enemy_kills}
                  </span>
                </div>
                Winrate:{" "}
                <span
                  className={cn(
                    duel.enemy_deaths > duel.enemy_kills
                      ? duel.player_team === match?.team_1_name
                        ? "text-blue-500"
                        : "text-red-500"
                      : duel.enemy_deaths < duel.enemy_kills
                      ? duel.player_team === match?.team_1_name
                        ? "text-red-500"
                        : "text-blue-500"
                      : "text-purple-500"
                  )}
                >
                  {(
                    (duel.enemy_deaths /
                      (duel.enemy_kills + duel.enemy_deaths)) *
                    100
                  ).toFixed(2)}
                  %
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="col-span-full 2xl:col-span-3 max-h-[80vh] overflow-y-auto">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Player Killfeed
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              A list of all the final blows and deaths for {playerName} in this
              match. Fights where {playerName} did not get a final blow are not
              shown.
            </p>
          </CardHeader>
          <CardContent>
            <KillfeedTable
              fights={fights}
              team1={match?.team_1_name ?? "Team 1"}
              team2={match?.team_2_name ?? "Team 2"}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
