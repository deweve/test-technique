import {
  GetFavoriteActivitiesQuery,
  GetFavoriteActivitiesQueryVariables,
  MutationSetPositionOfFavoriteActivityArgs,
  SetPositionOfFavoriteActivityMutation,
} from "@/graphql/generated/types";
import GetFavoriteActivities from "@/graphql/queries/activity/getFavoriteActities";
import { useAuth } from "@/hooks";
import { useMutation, useQuery } from "@apollo/client";
import { ActionIcon, Flex, Grid, Group, Title } from "@mantine/core";
import { ActivityListItem } from "../ActivityListItem";
import { IconArrowUp, IconArrowDown } from "@tabler/icons-react";

import SetPositionOfFavoriteActivity from "@/graphql/mutations/activity/setPositionOfFavoriteActivity";

export function ListFavoriteActivities() {
  const { user } = useAuth();
  const { data, refetch } = useQuery<
    GetFavoriteActivitiesQuery,
    GetFavoriteActivitiesQueryVariables
  >(GetFavoriteActivities);

  const [updatePositionOfFavorite] = useMutation<
    SetPositionOfFavoriteActivityMutation,
    MutationSetPositionOfFavoriteActivityArgs
  >(SetPositionOfFavoriteActivity, {
    onCompleted: () => {
      refetch();
    },
  });

  const upPositionFavorite = (
    actualPosition: number,
    favoriteActivityId: string
  ) => {
    updatePositionOfFavorite({
      variables: {
        position: actualPosition - 1,
        favoriteActivityId,
      },
    });
  };
  const downVotePositionFavorite = (
    actualPosition: number,
    favoriteActivityId: string
  ) => {
    updatePositionOfFavorite({
      variables: {
        position: actualPosition + 1,
        favoriteActivityId,
      },
    });
  };

  return (
    <>
      <Title>Mes favoris</Title>
      <Flex direction="column" gap="md">
        {data?.getFavoriteActivities.map((favoriteActivity) => (
          <Grid key={favoriteActivity.activity.id}>
            <Grid.Col span={11}>
              <ActivityListItem
                key={favoriteActivity.activity.id}
                activity={favoriteActivity.activity}
              ></ActivityListItem>
            </Grid.Col>
            <Grid.Col span={1}>
              <Flex direction="column" align="baseline">
                <ActionIcon
                  onClick={() =>
                    upPositionFavorite(
                      favoriteActivity.favoritePosition,
                      favoriteActivity.id
                    )
                  }
                >
                  <IconArrowUp />
                </ActionIcon>
                <ActionIcon
                  onClick={() =>
                    downVotePositionFavorite(
                      favoriteActivity.favoritePosition,
                      favoriteActivity.id
                    )
                  }
                >
                  <IconArrowDown />
                </ActionIcon>
              </Flex>
            </Grid.Col>
          </Grid>
        ))}
      </Flex>
    </>
  );
}
