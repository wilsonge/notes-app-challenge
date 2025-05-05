// import { JSX, useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
// import { Auth } from "aws-amplify";
// import { defineAuth } from "@aws-amplify/backend"
//
// const client = generateClient<Schema>();
//
// function App(): JSX.Element {
//     const [state, setState] = useState({ isLoggedIn: false, user: null });
//
//     const checkLoggedIn = () => {
//         Auth.currentAuthenticatedUser()
//             .then(data => {
//                 const user = { username: data.username, ...data.attributes };
//                 setState({ isLoggedIn: true, user });
//             })
//             .catch(error => console.log(error));
//     };
//
//     useEffect(() => {
//         checkLoggedIn();
//     }, []);
//
//     return <Screens />;
// }
//
// export default App;
