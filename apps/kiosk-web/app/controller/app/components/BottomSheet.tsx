"use client";

import Sheet from "react-modal-sheet";
import { controllerStore, toggleShowBottomSheet } from "../store";

export default function BottomSheet() {
  const show = controllerStore((state) => state.showBottomSheet);
  return (
    <div className="mx-0 my-auto max-w-lg">
      <Sheet isOpen={show} onClose={toggleShowBottomSheet} snapPoints={[0.8]}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className="p-4 pt-2 flex flex-col flex-1 gap-4 text-white h-full overflow-auto">
              <b className="text-xl">ตัวเล่น</b>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          // @ts-ignore
          onClick={() => show && toggleShowBottomSheet()}
        />
      </Sheet>
    </div>
  );
}
