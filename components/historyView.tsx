import { Shorted_url } from "../types/shortedURL";

import htyles from "../styles/Home.module.css";
import utyles from "../styles/util.module.css";
import SecondLayer_CardView from "./2L_CardView";
import Link from "next/link";

interface HistoryViewProps {
  history: Shorted_url[];
  name: string;
}

export default function HistoryView(props: HistoryViewProps) {
  return (
    <div className={htyles.feature}>
      <div>
        <h2 className={utyles.secName}>
          {props.name}
          <desc>최근 10개까지만 표시됩니다.</desc>
        </h2>
      </div>
      {props.history.map((v, i) => {
        return (
          <SecondLayer_CardView
            name={<Link href={`/${v.short}`}>https://poi.kr/{v.short}</Link>}
            desc={v.long}
            needDoted
            key={`HISVIEW.${i}`}
          />
        );
      })}
    </div>
  );
}
