import * as React from "react";
import Saved from '../Assets/SavedQuestions.png';
import Logo from '../Assets/logo.png'

export default function SavedQuestion() {
  return (
    <div className="flex flex-col items-center pb-5 bg-white">
      <div className="flex overflow-hidden relative flex-col self-stretch pt-5 pr-20 pb-12 pl-10 w-full text-white min-h-[560px] max-md:px-5 max-md:max-w-full">
        <img
          loading="lazy"
          srcSet={Saved}
          alt="img"
          className="object-cover absolute inset-0 size-full"
        />
        <div className="flex relative flex-col justify-center self-center px-7 py-2 max-w-full font-medium bg-black rounded-[100px] w-[890px] max-md:px-5">
          <div className="flex gap-5 justify-between items-center w-full max-md:flex-wrap max-md:max-w-full">
            <img
              loading="lazy"
              srcSet={Logo}
              alt="logo"
              className="self-stretch aspect-[1.06] w-[70px]"
            />
            <div className="flex gap-5 justify-between self-stretch my-auto text-xl">
              <div>HOME</div>
              <div className="flex-auto">Saved Questions</div>
            </div>
            <div className="flex flex-col justify-center self-stretch my-auto text-lg whitespace-nowrap">
              <div className="justify-center px-14 py-5 bg-sky-500 rounded-[100px] max-md:px-5">
                Login
              </div>
            </div>
          </div>
        </div>
        <div className="relative self-start mt-28 mb-40 text-8xl font-semibold max-md:my-10 max-md:max-w-full max-md:text-4xl">
          Saved Questions
        </div>
      </div>
      <div className="flex gap-5 justify-between px-5 mt-6 max-w-full text-3xl font-medium leading-8 text-black capitalize w-[830px] max-md:flex-wrap">
        <div className="flex-auto">The Great Gatsby</div>
        <div className="flex-auto">The Great Gatsby</div>
      </div>
      <div className="mt-4 w-full max-w-[1050px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
          <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow px-5 text-black capitalize leading-[100%] max-md:mt-10 max-md:max-w-full">
              <div className="flex flex-col px-14 py-4 text-lg bg-white rounded-3xl shadow-sm max-md:px-5 max-md:max-w-full">
                <div>Narrator impact in understanding?</div>
                <div className="mt-5">Lavish events, novel atmosphere?</div>
                <div className="mt-5 whitespace-nowrap">
                  Social, economic dynamics symbolism?
                </div>
                <div className="mt-5">Gatsby, Daisy, Tom and dream?</div>
                <div className="mt-5">
                  Essence and Gatsby's aspirations?
                </div>{" "}
                <div className="mt-5 mr-3 whitespace-nowrap max-md:mr-2.5">
                  Obstacles shaping gripping narrative?
                </div>{" "}
                <div className="mt-5 whitespace-nowrap">
                  Ambition and background significance?
                </div>{" "}
                <div className="mt-5">Wealth and class reflections?</div>{" "}
                <div className="mt-5">Downfall events and symbolism?</div>{" "}
                <div className="mt-5 whitespace-nowrap">
                  Fitzgerald's societal critiques portrayal?
                </div>
                <div className="justify-center self-center px-3 py-2.5 mt-5 text-xl font-medium text-white whitespace-nowrap bg-red-500 rounded-[100px]">
                  Questions delete
                </div>
              </div>
              <div className="mt-7 text-3xl font-medium max-md:max-w-full">
                The Great Gatsby
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow px-5 text-black capitalize leading-[100%] max-md:mt-10 max-md:max-w-full">
              <div className="flex flex-col px-14 py-4 text-lg bg-white rounded-3xl shadow-sm max-md:px-5 max-md:max-w-full">
                <div>Narrator impact in understanding?</div>
                <div className="mt-5">Lavish events, novel atmosphere?</div>
                <div className="mt-5 whitespace-nowrap">
                  Social, economic dynamics symbolism?
                </div>
                <div className="mt-5">Gatsby, Daisy, Tom and dream?</div>
                <div className="mt-5">
                  Essence and Gatsby's aspirations?
                </div>{" "}
                <div className="mt-5 mr-3 whitespace-nowrap max-md:mr-2.5">
                  Obstacles shaping gripping narrative?
                </div>{" "}
                <div className="mt-5 whitespace-nowrap">
                  Ambition and background significance?
                </div>{" "}
                <div className="mt-5">Wealth and class reflections?</div>{" "}
                <div className="mt-5">Downfall events and symbolism?</div>{" "}
                <div className="mt-5 whitespace-nowrap">
                  Fitzgerald's societal critiques portrayal?
                </div>
                <div className="justify-center self-center px-3 py-2.5 mt-5 text-xl font-medium text-white whitespace-nowrap bg-red-500 rounded-[100px]">
                  Questions delete
                </div>
              </div>
              <div className="mt-7 text-3xl font-medium max-md:max-w-full">
                The Great Gatsby
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 w-full max-w-[1050px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
          <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow px-14 py-4 w-full text-lg leading-5 text-black capitalize bg-white rounded-3xl shadow-sm max-md:px-5 max-md:mt-10 max-md:max-w-full">
              <div>Narrator impact in understanding?</div>
              <div className="mt-5">Lavish events, novel atmosphere?</div>
              <div className="mt-5 whitespace-nowrap">
                Social, economic dynamics symbolism?
              </div>
              <div className="mt-5">Gatsby, Daisy, Tom and dream?</div>
              <div className="mt-5">Essence and Gatsby's aspirations?</div>{" "}
              <div className="mt-5 mr-3 whitespace-nowrap max-md:mr-2.5">
                Obstacles shaping gripping narrative?
              </div>{" "}
              <div className="mt-5 whitespace-nowrap">
                Ambition and background significance?
              </div>{" "}
              <div className="mt-5">Wealth and class reflections?</div>{" "}
              <div className="mt-5">Downfall events and symbolism?</div>{" "}
              <div className="mt-5 whitespace-nowrap">
                Fitzgerald's societal critiques portrayal?
              </div>
              <div className="justify-center self-center px-3 py-2.5 mt-5 text-xl font-medium text-white whitespace-nowrap bg-red-500 rounded-[100px]">
                Questions delete
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow px-14 py-4 w-full text-lg leading-5 text-black capitalize bg-white rounded-3xl shadow-sm max-md:px-5 max-md:mt-10 max-md:max-w-full">
              <div>Narrator impact in understanding?</div>
              <div className="mt-5">Lavish events, novel atmosphere?</div>
              <div className="mt-5 whitespace-nowrap">
                Social, economic dynamics symbolism?
              </div>
              <div className="mt-5">Gatsby, Daisy, Tom and dream?</div>
              <div className="mt-5">Essence and Gatsby's aspirations?</div>{" "}
              <div className="mt-5 mr-3 whitespace-nowrap max-md:mr-2.5">
                Obstacles shaping gripping narrative?
              </div>{" "}
              <div className="mt-5 whitespace-nowrap">
                Ambition and background significance?
              </div>{" "}
              <div className="mt-5">Wealth and class reflections?</div>{" "}
              <div className="mt-5">Downfall events and symbolism?</div>{" "}
              <div className="mt-5 whitespace-nowrap">
                Fitzgerald's societal critiques portrayal?
              </div>
              <div className="justify-center self-center px-3 py-2.5 mt-5 text-xl font-medium text-white whitespace-nowrap bg-red-500 rounded-[100px]">
                Questions delete
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


