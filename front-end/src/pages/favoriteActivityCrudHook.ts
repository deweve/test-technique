import {
  GetLatestActivitiesQuery,
  SetFavoriteActivityMutation,
  SetFavoriteActivityMutationVariables,
  UnSetFavoriteActivityMutation,
  UnSetFavoriteActivityMutationVariables,
} from "@/graphql/generated/types";
import SetFavoriteActivity from "@/graphql/mutations/activity/setFavoriteActivity";
import UnSetFavoriteActivity from "@/graphql/mutations/activity/unSetFavoriteActivity";
import { useMutation } from "@apollo/client";
import { useState } from "react";

export function useFavoriteActivityCrud(
  activities: GetLatestActivitiesQuery["getLatestActivities"]
) {
  const [testActivities, setTestActivities] = useState(activities);
  const [setFavoriteActivityMutation] = useMutation<
    SetFavoriteActivityMutation,
    SetFavoriteActivityMutationVariables
  >(SetFavoriteActivity, {
    onCompleted: (data) => {
      const activity = activities.find(
        (activity) => activity.id === data.setFavoriteActivity.id
      );
      if (activity) {
        activity.isFavorite = data.setFavoriteActivity.isFavorite;
        setTestActivities([...activities]);
      }
    },
  });
  const [unSetFavoriteActivityMutation] = useMutation<
    UnSetFavoriteActivityMutation,
    UnSetFavoriteActivityMutationVariables
  >(UnSetFavoriteActivity, {
    onCompleted: (data) => {
      console.log(data);

      const activity = testActivities.find(
        (activity) => activity.id === data.unSetFavoriteActivity.id
      );
      if (activity) {
        activity.isFavorite = data.unSetFavoriteActivity.isFavorite;
        setTestActivities([...activities]);
      }
    },
  });

  const unsetFavoriteActivity = (activityId: string) => {
    void unSetFavoriteActivityMutation({ variables: { activityId } });
  };
  const setFavoriteActivity = (activityId: string) => {
    void setFavoriteActivityMutation({ variables: { activityId } });
  };
  return {
    activities: testActivities,
    unsetFavoriteActivity,
    setFavoriteActivity,
  };
}
