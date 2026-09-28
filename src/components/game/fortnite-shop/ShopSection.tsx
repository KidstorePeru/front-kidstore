"use client";
import { memo, useState } from "react";
import OfferCard from "./OfferCard";
import Slanted from "./Slanted";
import type { Offer, ShopGroup, ShopSection as Section } from "./model";
import type { ShopText } from "./i18n";

// Ofertas visibles en un grupo "expandableList" (pistas) antes de pulsar "Ver todo".
const LIST_PREVIEW = 4;

type CardProps = { t: ShopText; onOpen: (o: Offer) => void; sym: string; perVb: number };

function OfferGroup({ group, forceExpanded, ...card }: CardProps & { group: ShopGroup; forceExpanded: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const isList = group.displayType === "expandableList";
  const showAll = !isList || expanded || forceExpanded;
  const offers = showAll ? group.offers : group.offers.slice(0, LIST_PREVIEW);

  return (
    <div className="fns-group">
      <div className="fns-group__grid">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} {...card} />
        ))}
      </div>
      {isList && !forceExpanded && group.offers.length > LIST_PREVIEW && (
        <button type="button" className="fns-pill-button" onClick={() => setExpanded((v) => !v)}>
          {expanded ? card.t.seeLess : card.t.seeAll}
        </button>
      )}
    </div>
  );
}

function ShopSection({ section, filtering, ...card }: CardProps & { section: Section; filtering: boolean }) {
  return (
    <section id={section.domId} className="fns-section" aria-labelledby={`${section.domId}-title`}>
      <h2 id={`${section.domId}-title`} className="fns-section__title">
        <Slanted text={section.name} />
      </h2>
      {section.subtitle && (
        <p className="fns-section__subtitle">
          <Slanted text={section.subtitle} />
        </p>
      )}
      <div className="fns-section__groups">
        {section.groups.map((group) => (
          <OfferGroup key={group.id} group={group} forceExpanded={filtering} {...card} />
        ))}
      </div>
    </section>
  );
}

export default memo(ShopSection);
