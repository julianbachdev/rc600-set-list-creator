import React from "react";
import { RepertoireProvider } from "./RepertoireContext.js";
import { SetListsProvider } from "./SetListsContext.js";
import { SelectedSetListProvider } from "./SelectedSetListContext.js";
import { SetListsFinalProvider } from "./SetListsFinalContext.js";

export function AppProviders({ children }) {
  return (
    <RepertoireProvider>
      <SetListsProvider>
        <SelectedSetListProvider>
          <SetListsFinalProvider>{children}</SetListsFinalProvider>
        </SelectedSetListProvider>
      </SetListsProvider>
    </RepertoireProvider>
  );
}

export default AppProviders;
