const HomePage = () => {
  return (
    <header
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('./images/header_bg03.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-white text-xl  flex flex-col gap-6 items-center justify-center">
        <p>言語を選択してください</p>
        <p>Please select a language</p>
        <p>請選擇語言</p>
      </div>
      <div className="flex flex-col gap-2 items-center justify-center  mt-[7%]">
        <div className="flex flex-row gap-4 items-center justify-center">
          <div className="  border border-white p-2 text-white hover:bg-white hover:text-[#5AB9F1]">
            JP
          </div>
          <div className="  border border-white p-2 text-white hover:bg-white hover:text-[#5AB9F1]">
            EN
          </div>
          <div className="  border border-white p-2 text-white hover:bg-white hover:text-[#5AB9F1]">
            ZH
          </div>
        </div>
        <div className="text-white text-2xl mt-2 tracking-widest "></div>
      </div>
    </header>
  );
};

export default HomePage;
