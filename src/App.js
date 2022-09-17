import * as React from "react";
import EnhancedTable, {ResponsiveAppBar} from './invNav';
// import SignInSide from "./SignIn";

export default function App() {
  return (
    <div>
      {/* <SignInSide/> */}
        <ResponsiveAppBar />
        <EnhancedTable />
    </div>
  );
}
