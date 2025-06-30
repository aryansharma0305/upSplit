import React from "react";

const HomePageFooter = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-100 via-white to-gray-100 text-muted-foreground py-6 border-t">
      <div className=" w-full px-4 flex justify-center items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} UpSplit. All rights reserved.</p>
        
      </div>
    </footer>
  );
};

export default HomePageFooter;
