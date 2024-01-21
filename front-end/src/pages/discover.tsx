import { Activity, EmptyData, PageTitle } from "@/components";
import { graphqlClient } from "@/graphql/apollo";
import {
  GetActivitiesQuery,
  GetActivitiesQueryVariables,
} from "@/graphql/generated/types";
import GetActivities from "@/graphql/queries/activity/getActivities";
import { useAuth } from "@/hooks";
import { Button, Grid, Group } from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useFavoriteActivityCrud } from "./favoriteActivityCrudHook";

interface DiscoverProps {
  activities: GetActivitiesQuery["getActivities"];
}

export const getServerSideProps: GetServerSideProps<DiscoverProps> = async ({
  req,
}) => {
  const userConnected = !!req.headers.cookie;
  const response = await graphqlClient.query<
    GetActivitiesQuery,
    GetActivitiesQueryVariables
  >({
    query: GetActivities,
    variables: { userConnected },
    context: {
      headers: {
        Cookie: req.headers.cookie,
      },
    },
  });
  return { props: { activities: response.data.getActivities } };
};

export default function Discover({ activities }: DiscoverProps) {
  const { user } = useAuth();
  const {
    activities: activitiesToUse,
    unsetFavoriteActivity,
    setFavoriteActivity,
  } = useFavoriteActivityCrud(activities);

  return (
    <>
      <Head>
        <title>Discover | CDTR</title>
      </Head>
      <Group position="apart">
        <PageTitle title="Découvrez des activités" />
        {user && (
          <Link href="/activities/create">
            <Button>Ajouter une activité</Button>
          </Link>
        )}
      </Group>
      <Grid>
        {activitiesToUse.length > 0 ? (
          activities.map((activity) => (
            <Activity
              activity={activity}
              isFavorite={activity.isFavorite}
              unsetFavoriteActivity={unsetFavoriteActivity}
              setFavoriteActivity={setFavoriteActivity}
              key={activity.id}
            />
          ))
        ) : (
          <EmptyData />
        )}
      </Grid>
    </>
  );
}
