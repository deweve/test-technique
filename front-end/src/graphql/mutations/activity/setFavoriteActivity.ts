import gql from "graphql-tag";

const SetFavoriteActivity = gql`
  mutation setFavoriteActivity($activityId: String!) {
    setFavoriteActivity(activityId: $activityId) {
      id
      isFavorite
    }
  }
`;

export default SetFavoriteActivity;
