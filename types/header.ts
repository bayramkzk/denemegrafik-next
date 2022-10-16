export type HeaderSingularLinkData = {
  label: string;
  href: string;
  hasMenu: false;
};

export type HeaderMenuLinkData = {
  label: string;
  href: string;
  links: HeaderSingularLinkData[];
  hasMenu: true;
};

export type HeaderLinkData = HeaderSingularLinkData | HeaderMenuLinkData;
