import React from 'react';
import styled from 'styled-components';
import { style } from '@do/walrus';


// ============================================================
// DigitalOcean Cloud Panel — Create Managed Database (Summary)
// Figma: Visual Identity Exploration, node 189-1755
// ============================================================

// --- Layout Shell ---

const PageWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: ${style.colors.white};
`;

// --- Sidebar ---

const Sidebar = styled.nav`
  width: 200px;
  min-height: 100vh;
  background: #031b4e;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;
`;

const LogoArea = styled.div`
  padding: 18px 16px 14px;
  display: flex;
  align-items: center;
`;

const LogoMark = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const SidebarSection = styled.div`
  padding: 0;
`;

const SectionHeading = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
`;

const SectionLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #828fae;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const NavItem = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 4px 16px 4px 44px;
  height: 32px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  text-decoration: none;
  cursor: pointer;
  background: transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const ProjectItem = styled.a<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 8px 44px;
  height: 40px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  text-decoration: none;
  cursor: pointer;
  background: ${(p) => p.$selected ? 'rgba(91, 105, 135, 0.4)' : 'transparent'};
  border-radius: ${(p) => p.$selected ? '3px' : '0'};
  margin: ${(p) => p.$selected ? '0 7px' : '0'};

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const SidebarDivider = styled.div`
  height: 1px;
  background: #5b6987;
`;

const ExternalLinkItem = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  height: 48px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const SidebarSpacer = styled.div`
  flex: 1;
`;

// --- Top Nav Bar ---

const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  height: 72px;
  padding: 0 24px;
  background: #ffffff;
  border-bottom: 1px solid #e5e8ed;
  flex-shrink: 0;
  gap: 16px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  height: 48px;
  padding: 0 16px;
  background: #ffffff;
  border: none;
  border-radius: 3px;
  cursor: text;
`;

const SearchPlaceholder = styled.span`
  color: #828fae;
  font-size: 16px;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TopBarSpacer = styled.div`
  flex: 1;
`;

const CreateBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 48px;
  padding: 0 16px;
  background: #127c43;
  color: #ffffff;
  border: none;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #0f6b3a;
  }
`;

const TopBarDivider = styled.div`
  width: 1px;
  height: 41px;
  background: #e5e8ed;
`;

const IconBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #5b6987;
  border-radius: 50%;
  position: relative;

  &:hover {
    background: #f5f7fa;
  }
`;

const NotifDot = styled.span`
  position: absolute;
  top: 1px;
  right: 1px;
  width: 12px;
  height: 12px;
  background: #e6394a;
  border-radius: 50%;
  border: 1.5px solid #ffffff;
`;

const TeamSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px;
  border-radius: 3px;

  &:hover {
    background: #f5f7fa;
  }
`;

const TeamAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e681ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  color: #031b4e;
`;

const TeamInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TeamName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #031b4e;
  line-height: 1.2;
`;

const TeamBalance = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: #5b6987;
  line-height: 1.2;
`;

// --- Content ---

const ContentArea = styled.main`
  flex: 1;
  padding: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${style.vars.space['8']};
`;

// --- Summary Card ---

const SummaryCard = styled.div`
  width: 420px;
  background: #ffffff;
  border: 1px solid #828fae;
  border-radius: 3px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SummaryTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding-bottom: 24px;
  border-bottom: 1px solid #828fae;
`;

const ItemIcon = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;

const ItemDesc = styled.div`
  flex: 1;
`;

const ItemTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #031b4e;
  line-height: 1.4;
`;

const ItemDetail = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #031b4e;
  line-height: 1.4;
`;

const ItemPrice = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #828fae;
  flex-shrink: 0;
  white-space: nowrap;
`;

const CostRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const CostLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #031b4e;
`;

const CostValues = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const CostMonthly = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #031b4e;
`;

const CostHourly = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #5b6987;
`;

// --- AI Assistant Button ---

const AIAssistantBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 48px;
  padding: 0 16px;
  background: linear-gradient(18deg, #000C79 5.3%, #0A4EEB 26.7%, #0069FF 48.1%, #C6AEFF 96.1%);
  color: #ffffff;
  border: none;
  border-radius: 3px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    filter: brightness(1.1);
  }
`;

const AIIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_copilot)">
      <path d="M9.1801 4.83704C9.42168 3.82222 10.8492 3.82222 11.0908 4.83704L11.757 7.62963C11.8448 7.99259 12.123 8.27408 12.4817 8.36296L15.2416 9.03704C16.2445 9.28148 16.2445 10.7259 15.2416 10.9704L12.4817 11.6444C12.123 11.7333 11.8448 12.0148 11.757 12.3778L11.0908 15.1704C10.8492 16.1852 9.42168 16.1852 9.1801 15.1704L8.51392 12.3778C8.42608 12.0148 8.14789 11.7333 7.78918 11.6444L5.0293 10.9704C4.02637 10.7259 4.02637 9.28148 5.0293 9.03704L7.78918 8.36296C8.14789 8.27408 8.42608 7.99259 8.51392 7.62963L9.1801 4.83704Z" fill="white"/>
      <path d="M10.1172 20C9.71461 20 9.38518 19.6667 9.38518 19.2593C9.38518 18.8519 9.71461 18.5185 10.1172 18.5185C14.7585 18.5185 18.536 14.6963 18.536 10C18.536 5.3037 14.7585 1.48148 10.1172 1.48148C5.47596 1.48148 1.6985 5.3037 1.6985 10C1.6985 10.4074 1.36907 10.7407 0.966439 10.7407C0.563804 10.7407 0.234375 10.4074 0.234375 10C0.234375 4.48889 4.67069 0 10.1172 0C15.5638 0 20.0001 4.48889 20.0001 10C20.0001 15.5111 15.5638 20 10.1172 20Z" fill="white"/>
      <path d="M5.73949 16.1111C5.19044 16.1111 4.70728 15.6222 4.70728 15.0667C4.70728 14.5111 5.19044 14.0222 5.73949 14.0222C6.28853 14.0222 6.7717 14.5111 6.7717 15.0667C6.7717 15.6222 6.28853 16.1111 5.73949 16.1111Z" fill="white"/>
      <path d="M2.96495 17.8814C2.555 17.8814 2.18896 17.5184 2.18896 17.0962C2.18896 16.674 2.54768 16.311 2.96495 16.311C3.38223 16.311 3.74094 16.674 3.74094 17.0962C3.74094 17.5184 3.38223 17.8814 2.96495 17.8814Z" fill="white"/>
      <path d="M0.519766 15.7259C0.241581 15.7259 0 15.4815 0 15.2C0 14.9185 0.241581 14.6741 0.519766 14.6741C0.79795 14.6741 1.03953 14.9185 1.03953 15.2C1.03953 15.4815 0.79795 15.7259 0.519766 15.7259Z" fill="white"/>
    </g>
    <defs>
      <clipPath id="clip0_copilot">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

// --- Inline SVGs ---

const DOLogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 27.41V21.58C19.39 21.58 23.55 16.57 21.41 10.97C20.56 8.72 18.72 6.93 16.47 6.09C10.87 3.92 5.83 8.08 5.83 13.5H0C0 5.28 7.88-1.15 16.62 1.38C20.82 2.62 24.17 5.98 25.42 10.16C28 18.97 21.52 27.42 14 27.42V27.41Z" fill="white"/>
    <path d="M14 21.58H8.42V16H14V21.58Z" fill="white"/>
    <path d="M8.42 25.07H3.93V21.58H8.42V25.07Z" fill="white"/>
    <path d="M3.93 21.58H1.09V18.74H3.93V21.58Z" fill="white"/>
  </svg>
);

const SearchIconSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b6987" strokeWidth="2" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="6" />
    <line x1="14.5" y1="14.5" x2="20" y2="20" />
  </svg>
);

const ChevronDown = ({ color = '#5b6987' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BellIcon = () => (
  <svg width="21" height="23" viewBox="0 0 21 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15.2547C21 16.6763 19.8442 17.8302 18.4206 17.8302H2.57939C1.15501 17.8302 0 16.6778 0 15.2547C0 13.9004 1.04794 12.7885 2.37736 12.6868V8.12234C2.37736 3.63535 6.01345 0 10.5 0C14.9866 0 18.6226 3.63621 18.6226 8.12234V12.6868C19.9503 12.7886 21 13.9 21 15.2547ZM18.4237 14.6604C17.4386 14.6604 16.6415 13.8637 16.6415 12.8767V8.12234C16.6415 4.73034 13.8924 1.98113 10.5 1.98113C7.10751 1.98113 4.35849 4.72959 4.35849 8.12234V12.8767C4.35849 13.8611 3.55974 14.6604 2.5763 14.6604C2.24827 14.6604 1.98113 14.9276 1.98113 15.2547C1.98113 15.5826 2.24816 15.8491 2.57939 15.8491H18.4206C18.7508 15.8491 19.0189 15.5814 19.0189 15.2547C19.0189 14.9281 18.7507 14.6604 18.4237 14.6604ZM6.73585 18.8208H8.71698C8.71698 19.8055 9.51527 20.6038 10.5 20.6038C11.4847 20.6038 12.283 19.8055 12.283 18.8208H14.2642C14.2642 20.8996 12.5789 22.5849 10.5 22.5849C8.42112 22.5849 6.73585 20.8996 6.73585 18.8208Z" fill="#5B6987"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.2927 14.5964C11.684 14.5964 12.0042 14.7152 12.2439 14.9597L12.3289 15.0525C12.5151 15.2739 12.6081 15.5408 12.6082 15.8503C12.6082 16.1948 12.4868 16.4887 12.2439 16.7263C12.0039 16.9609 11.6836 17.075 11.2927 17.075C10.9425 17.0749 10.6516 16.9879 10.4265 16.8083L10.3337 16.7253C10.1013 16.4874 9.98511 16.1938 9.98511 15.8503C9.9852 15.4976 10.1009 15.199 10.3337 14.9607C10.569 14.715 10.8921 14.5965 11.2927 14.5964ZM11.3689 5.59155C11.9376 5.59155 12.4497 5.65584 12.9041 5.78491C13.3019 5.89794 13.6483 6.05929 13.9421 6.26929L14.0652 6.36206L14.0662 6.36304C14.3795 6.62422 14.62 6.94538 14.7869 7.32593C14.9541 7.70746 15.0368 8.14711 15.0369 8.64233C15.0369 8.91883 15.002 9.17943 14.9314 9.42261L14.8484 9.66089C14.7241 9.96115 14.5637 10.2409 14.3669 10.4998L14.366 10.4988C14.1705 10.7611 13.9475 11.0107 13.696 11.2468V11.2478C13.4531 11.4755 13.2067 11.6971 12.9587 11.9148C12.8081 12.0655 12.6924 12.1977 12.6091 12.3103C12.5274 12.4208 12.471 12.5322 12.4382 12.6443L12.4373 12.6472C12.3989 12.7621 12.3748 12.8903 12.365 13.032C12.3421 13.3525 12.0859 13.6199 11.7566 13.6199H11.2634C10.7318 13.6199 10.2864 13.1871 10.3201 12.6492V12.6482C10.3408 12.3998 10.3848 12.1728 10.4529 11.9685V11.9675C10.5045 11.8166 10.5756 11.6745 10.6658 11.5417L10.7625 11.4119C10.8992 11.2385 11.0888 11.0567 11.3298 10.8669C11.5002 10.7115 11.6711 10.5491 11.8416 10.3787C12.0116 10.2035 12.1665 10.0234 12.3064 9.83862C12.4403 9.66012 12.5488 9.47706 12.6326 9.28979C12.7149 9.10575 12.7556 8.92317 12.7556 8.74194C12.7556 8.51528 12.7235 8.32425 12.6619 8.16772V8.16675C12.6003 8.00584 12.5134 7.87548 12.4031 7.77319L12.3093 7.70679C12.2106 7.64454 12.0965 7.59471 11.9656 7.55835H11.9646C11.7953 7.51 11.597 7.48511 11.3689 7.48511C11.1933 7.48513 11.0227 7.5087 10.8572 7.55737L10.8552 7.55835C10.6925 7.60146 10.5497 7.6727 10.4265 7.77222L10.4255 7.77319C10.2978 7.87251 10.1928 8.00131 10.1111 8.15991C9.95781 8.47502 9.68496 8.80143 9.29565 8.80151H8.80151C8.5033 8.80149 8.22553 8.67676 8.0437 8.47827C7.86072 8.27838 7.77439 8.00216 7.86792 7.70874C7.90828 7.58225 7.9568 7.46127 8.01343 7.34644L8.08862 7.20093C8.27188 6.86979 8.50793 6.58944 8.79565 6.36108C9.12349 6.10097 9.50771 5.90909 9.94702 5.78491C10.3859 5.65583 10.8603 5.59157 11.3689 5.59155Z" fill="#5B6987" stroke="#5B6987" strokeWidth="0.15"/>
    <circle cx="11.3333" cy="11.3333" r="10" stroke="#5B6987" strokeWidth="2"/>
  </svg>
);

const DatabaseIconSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="6" rx="8" ry="3" fill="#cee0fa" stroke="#003f99" strokeWidth="1"/>
    <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="#003f99" strokeWidth="1"/>
    <ellipse cx="12" cy="12" rx="8" ry="3" fill="#cee0fa" stroke="#003f99" strokeWidth="1"/>
    <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="#003f99" strokeWidth="1"/>
    <ellipse cx="12" cy="18" rx="8" ry="3" fill="#cee0fa" stroke="#003f99" strokeWidth="1"/>
  </svg>
);

const VolumeIconSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="16" rx="2" fill="#cee0fa" stroke="#003f99" strokeWidth="1"/>
    <rect x="6" y="8" width="4" height="3" rx="0.5" fill="#003f99"/>
    <rect x="6" y="13" width="4" height="3" rx="0.5" fill="#003f99"/>
    <circle cx="16" cy="16" r="1" fill="#003f99"/>
  </svg>
);

const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-7l-2-2H5c-1.1 0-2 .9-2 2z"/>
  </svg>
);

// --- Nav Data ---

const MANAGE_ITEMS = [
  'Droplets', 'Apps', 'Kubernetes', 'Volumes', 'Databases',
  'Spaces', 'Images', 'Container Registry', 'Networking', 'Monitoring',
];

const PROJECTS = [
  { name: 'first-project', selected: true },
  { name: 'project-name', selected: false },
  { name: 'project-name', selected: false },
  { name: 'project-name', selected: false },
];

// --- Page Component ---

export default function DatabaseCreate() {
  return (
    <ContentArea />
  );
}
