import {
  Burger,
  createStyles,
  Group,
  Header as MantineHeader,
  MediaQuery,
  Text,
} from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { HEADER_HEIGHT } from "../constants";

const useStyles = createStyles((theme) => ({
  burger: {
    color: theme.colors.gray[6],
  },
}));

export type HeaderProps = {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
};

const Header: React.FC<HeaderProps> = ({ opened, setOpened }) => {
  const { classes } = useStyles();

  return (
    <MantineHeader height={HEADER_HEIGHT} p="md">
      <Group>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            className={classes.burger}
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            mr="xl"
          />
        </MediaQuery>

        <Text size="xl" weight={500}>
          Header
        </Text>
      </Group>
    </MantineHeader>
  );
};

export default Header;
