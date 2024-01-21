import gql from "graphql-tag";

const UnSetFavoriteActivity = gql`
  mutation unSetFavoriteActivity($activityId: String!) {
    unSetFavoriteActivity(activityId: $activityId) {
      id
      isFavorite
    }
  }
`;

export default UnSetFavoriteActivity;
