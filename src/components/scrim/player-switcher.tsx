"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, toHero } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

interface TeamGroup {
  label: string;
  players: { label: string; value: string }[];
}

interface Player {
  label: string;
  value: string;
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

type MostPlayedHeroesType = {
  player_team: string;
  player_name: string;
  player_hero: string;
  hero_time_played: number;
}[];

export default function PlayerSwitcher({
  className,
  mostPlayedHeroes,
  scrimId,
}: TeamSwitcherProps & {
  mostPlayedHeroes: MostPlayedHeroesType;
  scrimId: number;
}) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player>({
    label: "Default",
    value: "default",
  });
  const [avatar, setAvatar] = React.useState<string>("default");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  React.useEffect(() => {
    const playerExists = mostPlayedHeroes.find(
      (playerStat) => playerStat.player_name === searchParams.get("player")
    );

    if (searchParams.has("player") && !playerExists) {
      router.push(pathname);
    }
  }, [mostPlayedHeroes, pathname, router, searchParams]);

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  function createTeamGroups(playerStats: MostPlayedHeroesType): TeamGroup[] {
    const teamGroupsMap = new Map<string, TeamGroup>();

    // Organize player stats by team
    playerStats.forEach((playerStat) => {
      let teamGroup = teamGroupsMap.get(playerStat.player_team);

      // If the team doesn't exist in the map, create it
      if (!teamGroup) {
        teamGroup = { label: playerStat.player_team, players: [] };
        teamGroupsMap.set(playerStat.player_team, teamGroup);
      }

      // Add the player and their most played hero to the team
      teamGroup.players.push({
        label: playerStat.player_name,
        value: playerStat.player_hero,
      });
    });

    // Convert the map to an array
    return Array.from(teamGroupsMap.values());
  }

  const teams = createTeamGroups(mostPlayedHeroes).sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a player"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`/heroes/${toHero(selectedPlayer.value)}.png`}
                alt={selectedPlayer.label}
              />
              <AvatarFallback>lux</AvatarFallback>
            </Avatar>
            {selectedPlayer.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search player..." />
              <CommandEmpty>No player found.</CommandEmpty>
              {teams.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.players.map((player) => (
                    <CommandItem
                      key={player.label}
                      onSelect={() => {
                        router.push(
                          pathname +
                            "?" +
                            createQueryString("player", player.label)
                        );
                        setSelectedPlayer(player);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`/heroes/${toHero(player.value)}.png`}
                          alt={player.label}
                          // className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {player.label} {/* Use player.label directly here */}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedPlayer.label === player.label
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      router.push(pathname);
                      setSelectedPlayer({
                        label: "Default",
                        value: "default",
                      });
                    }}
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`/heroes/default.png`}
                        alt={"Default"}
                        // className="grayscale"
                      />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    Default
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedPlayer.label === "Default"
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  );
}

type PlayerContextType = {
  selectedPlayer: Player;
  setSelectedPlayer: React.Dispatch<React.SetStateAction<Player>>;
};

export const SelectedPlayerContext = React.createContext<PlayerContextType>({
  selectedPlayer: {
    label: "Default",
    value: "default",
  },
  setSelectedPlayer: () => {},
});

export function SelectedPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player>({
    label: "Default",
    value: "default",
  });

  return (
    <SelectedPlayerContext.Provider
      value={{
        selectedPlayer: selectedPlayer,
        setSelectedPlayer: setSelectedPlayer,
      }}
    >
      {children}
    </SelectedPlayerContext.Provider>
  );
}
