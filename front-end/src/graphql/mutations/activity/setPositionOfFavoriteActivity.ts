import gql from "graphql-tag";

// const SetPositionOfFavoriteActivity = gql`
//     mutation setPositionOfFavoriteActivity($favoriteActivityId: $String!) {
//         setPositionOfFavoriteActivity(favoriteActivityId: $favoriteActivityId) {
//             favoritePosition
//         }
//     }
// `;

const SetPositionOfFavoriteActivity = gql`
  mutation setPositionOfFavoriteActivity(
    $favoriteActivityId: String!
    $position: Int!
  ) {
    setPositionOfFavoriteActivity(
      favoriteActivityId: $favoriteActivityId
      position: $position
    ) {
      favoritePosition
    }
  }
`;

export default SetPositionOfFavoriteActivity;
