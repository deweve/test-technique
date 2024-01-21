import ActivityFragment from "@/graphql/fragments/activity";
import gql from "graphql-tag";

const GetActivities = gql`
  query GetActivities($userConnected: Boolean!) {
    getActivities {
      ...Activity
      isFavorite @include(if: $userConnected)
    }
  }
  ${ActivityFragment}
`;

export default GetActivities;
