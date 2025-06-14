import React from "react";

const HomePageFooter = () => {
  return (
    <footer className="bg-muted text-muted-foreground py-6 border-t">
      <div className=" w-full px-4 flex justify-center items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} UpSplit. All rights reserved.</p>
        
      </div>
    </footer>
  );
};

export default HomePageFooter;
