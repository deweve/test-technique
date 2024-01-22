import ActivityFragment from "@/graphql/fragments/activity";
import gql from "graphql-tag";

const GetFavoriteActivities = gql`
  query GetFavoriteActivities {
    getFavoriteActivities {
      id
      favoritePosition
      activity {
        ...Activity
        isFavorite
      }
    }
  }
  ${ActivityFragment}
`;

export default GetFavoriteActivities;
