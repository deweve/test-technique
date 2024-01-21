import { ActivityFragment } from "@/graphql/generated/types";
import { useGlobalStyles } from "@/utils";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Image,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

type FavoriteProps =
  | {
      isFavorite: boolean;
      setFavoriteActivity: (favoriteId: string) => void;
      unsetFavoriteActivity: (favoriteId: string) => void;
    }
  | { isFavorite?: undefined };
interface ActivityProps {
  activity: ActivityFragment;
}

export function Activity(props: ActivityProps & FavoriteProps) {
  const { classes } = useGlobalStyles();
  const { activity } = props;

  return (
    <Grid.Col span={4}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image
            src="https://source.unsplash.com/random/?city"
            height={160}
            alt="random image of city"
          />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500} className={classes.ellipsis}>
            {activity.name}
          </Text>
          {props.isFavorite !== undefined && (
            <ActionIcon
              color="red"
              onClick={() => {
                props.isFavorite
                  ? props.unsetFavoriteActivity(activity.id)
                  : props.setFavoriteActivity(activity.id);
              }}
            >
              {props.isFavorite ? <IconHeartFilled /> : <IconHeart />}
            </ActionIcon>
          )}
        </Group>

        <Group mt="md" mb="xs">
          <Badge color="pink" variant="light">
            {activity.city}
          </Badge>
          <Badge color="yellow" variant="light">
            {`${activity.price}€/j`}
          </Badge>
        </Group>

        <Text size="sm" color="dimmed" className={classes.ellipsis}>
          {activity.description}
        </Text>

        <Link href={`/activities/${activity.id}`} className={classes.link}>
          <Button variant="light" color="blue" fullWidth mt="md" radius="md">
            Voir plus
          </Button>
        </Link>
      </Card>
    </Grid.Col>
  );
}
