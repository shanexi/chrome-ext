import React from "react";
import KittyIcon from "../../icons/kitty.svg";

const FloatingBall: React.FC = () => {
  const handleClick = () => {
    console.log("Floating ball clicked");
    chrome.runtime.sendMessage({
      action: "openSidePanel",
      data: { source: "floatingBall" },
    });
  };

  return (
    <div
      className="fixed right-[15px] top-1/2 -translate-y-1/2 w-[36px] h-[36] cursor-pointer z-[10000] select-none pointer-events-auto"
      onClick={handleClick}
    >
      <KittyIcon className="max-w-full max-h-full fill-white" />
    </div>
  );
};

export default FloatingBall;
