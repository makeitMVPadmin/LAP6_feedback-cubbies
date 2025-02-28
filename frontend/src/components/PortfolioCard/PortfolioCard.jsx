import plusIcon from "../../assets/plus.svg";
import { useNavigation } from "../../context/NavigationContext";
import BoostButton from "../BoostsBtn/BoostsBtn";
import {
  Button,
  Card,
  CardContent,
  Avatar,
  CardTitle,
  VisibilityIcon,
} from "../ui/index";

const PortfolioCard = ({ portfolio, user, role, tags }) => {
  const { goToProfileDetails } = useNavigation();

  return (
    <Card
      key={portfolio.id}
      className="w-full max-w-[754px] py-6 px-8 bg-white rounded-lg border-l border-r-2 border-t border-b-2 border-[#28363f] flex flex-col justify-start items-start overflow-hidden"
    >
      <CardContent className="h-6 w-15 px-2.5 py-1 mt-1.4 ms-4 bg-[#ebebeb] rounded-lg justify-center items-center gap-0.5 inline-flex text-slate-900 text-sm font-semibold font-['Inter'] leading-none">
        New
      </CardContent>

      <div className="w-full flex justify-start items-center gap-4 pt-3 pl-1 pb-0.5 ms-[4.18rem]">
        <div className="w-9 h-9 flex justify-center items-center">
          <Avatar className="w-9 h-9 rounded-full" />
        </div>

        <div className="flex w-full items-center gap-4 pb-1">
          <div className="text-slate-950 text-xl flex flex-row font-semibold font-['Montserrat'] leading-7">
            {user?.firstName} {user?.lastName}
          </div>
          <div className="text-slate-500 font-header font-bold font-['Montserrat'] leading-tight">
            {user?.email}
          </div>
        </div>
      </div>

      <div className="h-6 pl-22 justify-items-center gap-4 pt-1 inline-flex">
        <div className="text-slate-500 text-xs font-bold font-['Montserrat'] leading-none pl-8">
          New Grad
        </div>
        <div className="text-slate-500 text-xs font-bold font-['Montserrat'] leading-none">
          1 day ago
        </div>
      </div>

      <CardTitle className="text-black text-xl font-bold font-['Montserrat'] leading-loose text-left py-6 ml-[70px]">
        <p>{portfolio.description}</p>
      </CardTitle>

      {portfolio.imageUrl && (
        <div className="flex justify-center items-center w-full">
          <div className="w-full max-w-[570px] h-[188px] flex-shrink-0 rounded-lg overflow-hidden border border-gray-300 shadow-lg">
            <img
              className="w-full h-full object-cover"
              src={portfolio.imageUrl}
              alt={portfolio.title}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 mt-6 w-full items-start ml-[70px]">
        <div className="flex flex-wrap gap-2 rounded-lg">
          {Array.isArray(tags) ? (
            tags.map((tag) => (
              <div
                key={tag.id}
                className="px-6 py-2 bg-[#ebebeb] rounded-[9px] justify-center items-center gap-6 inline-flex mr-[11px]"
              >
                <div className="text-black/70 text-lg font-semibold font-['Montserrat'] leading-relaxed">
                  {tag.tagName}
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-2 bg-[#ebebeb] rounded-[9px] justify-center items-center gap-6 inline-flex mr-[11px]">
              <div className="text-black/70 text-lg font-semibold font-['Montserrat'] leading-relaxed">
                {tags.tagName}
              </div>
            </div>
          )}
          <div className="inline-flex items-center gap-4">
            <img src={plusIcon} alt="plus icon" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 rounded-lg">
          <Button className="h-[45.85px] pl-[13.75px] pr-[18.34px] bg-[#0264d4] rounded-xl justify-items-center items-center text-center gap-[9.17px] inline-flex text-lg font-medium font-['Montserrat'] leading-7">
            <VisibilityIcon className="w-12 h-12" />
            <a href={portfolio.link} target="_blank" rel="noopener noreferrer">
              Review Portfolio
            </a>
          </Button>

          <BoostButton portfolioId={portfolio.id} />

          <Button
            onClick={() => goToProfileDetails(portfolio.id)}
            className="h-[45.85px] px-[13.75px] py-[18.34px] bg-white rounded-xl shadow-md flex justify-center items-center gap-[9.17px] text-[#28363f] text-lg font-medium font-['Montserrat'] leading-7"
          >
            Comments
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PortfolioCard;
