import React from 'react';
import styled from 'styled-components';
import {
  style,
  Button,
  TabbedContent,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  SelectMenu,
} from '@do/walrus';

// ============================================================
// Create GPU Droplet Page
// ============================================================

// --- Data ---

const REGIONS = [
  { label: 'New York \u2022 Datacenter 2 \u2022 NYC2', value: 'nyc2' },
  { label: 'San Francisco \u2022 Datacenter 3 \u2022 SFO3', value: 'sfo3' },
  { label: 'Amsterdam \u2022 Datacenter 3 \u2022 AMS3', value: 'ams3' },
  { label: 'Singapore \u2022 Datacenter 1 \u2022 SGP1', value: 'sgp1' },
  { label: 'London \u2022 Datacenter 1 \u2022 LON1', value: 'lon1' },
  { label: 'Toronto \u2022 Datacenter 1 \u2022 TOR1', value: 'tor1' },
];

const OS_IMAGES = [
  {
    id: 'aiml',
    name: 'AI/ML Ready',
    description: 'Recommended: Linux bundled with required GPU Drivers',
    link: true,
    selected: true,
  },
  {
    id: 'inference',
    name: 'Inference Optimized',
    description: 'Deploy any model faster with production-grade-performance',
    link: false,
    selected: false,
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    version: '25.10 x64',
    selected: false,
  },
  {
    id: 'fedora',
    name: 'Fedora',
    description: 'Requires an SSH Key',
    version: '43 x64',
    selected: false,
  },
];

const GPU_PLAN_TABS = ['H200', 'H100', 'L40S', 'RTX 6000 ADA', 'RTX 4000 ADA'];

const BACKUP_HOURLY = 0.31;
const VOLUME_HOURLY = 0.015;

interface GpuPlan {
  id: string;
  name: string;
  specs: string;
  bootDisk: string;
  scratchDisk: string;
  price: string;
  pricePerHr: number;
  gpuCount: number;
  vram: string;
  vcpu: number;
  ram: string;
}

const GPU_PLANS: Record<string, GpuPlan[]> = {
  H200: [
    {
      id: 'h200x8',
      name: 'H200 x8',
      specs: '8 GPU - 1.1 TB VRAM - 192 vCPU - 1920 GB RAM',
      bootDisk: '2 TB NVMe',
      scratchDisk: '40 TB NVMe',
      price: '$3.44/GPU/hr',
      pricePerHr: 27.52,
      gpuCount: 8,
      vram: '1.1 TB',
      vcpu: 192,
      ram: '1920 GB',
    },
    {
      id: 'h200',
      name: 'H200',
      specs: '1 GPU - 141 GB VRAM - 24 vCPU - 240 GB RAM',
      bootDisk: '720 GB NVMe',
      scratchDisk: '5 TB NVMe',
      price: '$3.44/GPU/hr',
      pricePerHr: 3.44,
      gpuCount: 1,
      vram: '141 GB',
      vcpu: 24,
      ram: '240 GB',
    },
  ],
  H100: [
    {
      id: 'h100x8',
      name: 'H100 x8',
      specs: '8 GPU - 640 GB VRAM - 192 vCPU - 1920 GB RAM',
      bootDisk: '2 TB NVMe',
      scratchDisk: '25 TB NVMe',
      price: '$2.50/GPU/hr',
      pricePerHr: 20.0,
      gpuCount: 8,
      vram: '640 GB',
      vcpu: 192,
      ram: '1920 GB',
    },
    {
      id: 'h100',
      name: 'H100',
      specs: '1 GPU - 80 GB VRAM - 24 vCPU - 240 GB RAM',
      bootDisk: '720 GB NVMe',
      scratchDisk: '3.5 TB NVMe',
      price: '$2.50/GPU/hr',
      pricePerHr: 2.5,
      gpuCount: 1,
      vram: '80 GB',
      vcpu: 24,
      ram: '240 GB',
    },
  ],
  L40S: [
    {
      id: 'l40s',
      name: 'L40S',
      specs: '1 GPU - 48 GB VRAM - 24 vCPU - 240 GB RAM',
      bootDisk: '720 GB NVMe',
      scratchDisk: '3.5 TB NVMe',
      price: '$1.84/GPU/hr',
      pricePerHr: 1.84,
      gpuCount: 1,
      vram: '48 GB',
      vcpu: 24,
      ram: '240 GB',
    },
  ],
  'RTX 6000 ADA': [
    {
      id: 'rtx6000',
      name: 'RTX 6000 ADA',
      specs: '1 GPU - 48 GB VRAM - 16 vCPU - 128 GB RAM',
      bootDisk: '500 GB NVMe',
      scratchDisk: '2 TB NVMe',
      price: '$1.20/GPU/hr',
      pricePerHr: 1.20,
      gpuCount: 1,
      vram: '48 GB',
      vcpu: 16,
      ram: '128 GB',
    },
  ],
  'RTX 4000 ADA': [
    {
      id: 'rtx4000',
      name: 'RTX 4000 ADA',
      specs: '1 GPU - 20 GB VRAM - 8 vCPU - 64 GB RAM',
      bootDisk: '250 GB NVMe',
      scratchDisk: '1 TB NVMe',
      price: '$0.68/GPU/hr',
      pricePerHr: 0.68,
      gpuCount: 1,
      vram: '20 GB',
      vcpu: 8,
      ram: '64 GB',
    },
  ],
};

function findPlanById(id: string): GpuPlan | undefined {
  for (const plans of Object.values(GPU_PLANS)) {
    const found = plans.find((p) => p.id === id);
    if (found) return found;
  }
  return undefined;
}

// --- Icons ---

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5L10 2z" fill={style.colors.primary.base} />
    <path d="M15 12l.75 2.25L18 15l-2.25.75L15 18l-.75-2.25L12 15l2.25-.75L15 12z" fill={style.colors.primary.base} />
  </svg>
);

const UbuntuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8" stroke={style.colors.grey.darkest} strokeWidth="1.5" fill="none" />
    <circle cx="10" cy="4" r="1.5" fill={style.colors.grey.darkest} />
    <circle cx="4.8" cy="13" r="1.5" fill={style.colors.grey.darkest} />
    <circle cx="15.2" cy="13" r="1.5" fill={style.colors.grey.darkest} />
  </svg>
);

const FedoraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8" stroke={style.colors.grey.darkest} strokeWidth="1.5" fill="none" />
    <text x="10" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill={style.colors.grey.darkest}>f</text>
  </svg>
);

const FlagIcon = () => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="5.33" fill="#002868" />
    <rect y="5.33" width="20" height="5.34" fill="white" />
    <rect y="10.67" width="20" height="5.33" fill="#BF0A30" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke={style.colors.primary.base} strokeWidth="1.5" fill="none" />
    <path d="M8 7v4" stroke={style.colors.primary.base} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="5" r="0.75" fill={style.colors.primary.base} />
  </svg>
);

const ChevronDownSmall = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke={style.colors.grey.dark} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// --- Layout ---

const PageLayout = styled.div`
  display: flex;
  gap: ${style.vars.space['8']};
  max-width: 1200px;
  margin: 0 auto;
  padding: ${style.vars.space['8']} ${style.vars.space['6']};
  align-items: flex-start;
`;

const MainColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['8']};
`;

const SidebarColumn = styled.aside`
  width: 320px;
  flex-shrink: 0;
  position: sticky;
  top: ${style.vars.space['8']};
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['4']};
`;

const PageTitle = styled.h1`
  font-size: calc(${style.vars.fontSize.large} * 1.6);
  font-weight: ${style.vars.fontWeight.bolder};
  color: ${style.colors.grey.darkest};
  margin: 0;
`;

// --- Section ---

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['3']};
`;

const SectionTitle = styled.h2`
  font-size: ${style.vars.fontSize.base};
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
  margin: 0;
`;

const SectionSubtext = styled.p`
  font-size: ${style.vars.fontSize.small};
  color: ${style.colors.grey.dark};
  margin: 0;
`;

// --- Out of Stock Banner ---

const BannerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${style.vars.space['5']};
  padding: ${style.vars.space['5']};
  background: linear-gradient(135deg, #0a1628 0%, #0d2137 100%);
  border-radius: ${style.vars.borderRadius.large};
  color: ${style.colors.white};
`;

const BannerImage = styled.div`
  width: 120px;
  height: 100px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #1a3a5c 0%, #0d2137 100%);
  border-radius: ${style.vars.borderRadius.base};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['2']};
`;

const BannerTitle = styled.h3`
  font-size: ${style.vars.fontSize.base};
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.white};
  margin: 0;
`;

const BannerText = styled.p`
  font-size: ${style.vars.fontSize.small};
  color: ${style.colors.grey.light};
  margin: 0;
  line-height: 1.5;
`;

// --- Region Selector ---

const RegionDropdownWrapper = styled.div`
  width: 100%;
  > div { width: 100%; }
`;

const RegionSubtext = styled.span`
  font-size: ${style.vars.fontSize.xsmall};
  color: ${style.colors.grey.dark};
  margin-top: ${style.vars.space['1']};
`;

// --- Radio Card ---

const RadioCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const RadioCard = styled.label<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${style.vars.space['3']};
  padding: ${style.vars.space['3']} ${style.vars.space['4']};
  border: ${style.vars.borderWidth.thin} solid ${(p) => p.$selected ? style.colors.primary.base : style.colors.grey.light};
  background: ${(p) => p.$selected ? '#f0f6ff' : style.colors.white};
  cursor: pointer;
  transition: border-color ${style.vars.transitionSpeed.base} ${style.vars.easeInOutCubic},
    background ${style.vars.transitionSpeed.base} ${style.vars.easeInOutCubic};

  &:first-child {
    border-radius: ${style.vars.borderRadius.base} ${style.vars.borderRadius.base} 0 0;
  }
  &:last-child {
    border-radius: 0 0 ${style.vars.borderRadius.base} ${style.vars.borderRadius.base};
  }
  & + & {
    margin-top: -1px;
  }

  &:hover {
    border-color: ${style.colors.primary.base};
  }
`;

const RadioDot = styled.div<{ $selected?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: ${style.vars.borderWidth.base} solid ${(p) => p.$selected ? style.colors.primary.base : style.colors.grey.dark};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${(p) => p.$selected ? style.colors.primary.base : 'transparent'};
  }
`;

const RadioCardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['1']};
`;

const RadioCardTitle = styled.span`
  font-size: ${style.vars.fontSize.base};
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
`;

const RadioCardDesc = styled.span`
  font-size: ${style.vars.fontSize.small};
  color: ${style.colors.grey.dark};
`;

const RadioCardLink = styled.a`
  color: ${style.colors.primary.base};
  text-decoration: underline;
  font-size: ${style.vars.fontSize.small};
  cursor: pointer;
`;

const RadioCardRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${style.vars.space['1']};
  font-size: ${style.vars.fontSize.small};
  color: ${style.colors.grey.dark};
  flex-shrink: 0;
`;

const RadioCardIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

// --- GPU Platform Selector ---

const PlatformRow = styled.div`
  display: flex;
  gap: 0;
`;

const PlatformOption = styled.label<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${style.vars.space['2']};
  padding: ${style.vars.space['2']} ${style.vars.space['5']};
  border: ${style.vars.borderWidth.thin} solid ${(p) => p.$selected ? style.colors.primary.base : style.colors.grey.light};
  background: ${(p) => p.$selected ? '#f0f6ff' : style.colors.white};
  cursor: pointer;
  font-size: ${style.vars.fontSize.base};
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
  transition: border-color ${style.vars.transitionSpeed.base} ${style.vars.easeInOutCubic};

  &:first-child {
    border-radius: ${style.vars.borderRadius.base} 0 0 ${style.vars.borderRadius.base};
  }
  &:last-child {
    border-radius: 0 ${style.vars.borderRadius.base} ${style.vars.borderRadius.base} 0;
    margin-left: -1px;
  }

  &:hover {
    border-color: ${style.colors.primary.base};
  }
`;

// --- GPU Plan Card ---

const PlanCard = styled.label<{ $selected?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${style.vars.space['3']};
  padding: ${style.vars.space['4']};
  border: ${style.vars.borderWidth.thin} solid ${(p) => p.$selected ? style.colors.primary.base : style.colors.grey.light};
  background: ${(p) => p.$selected ? '#f0f6ff' : style.colors.white};
  border-radius: ${style.vars.borderRadius.base};
  cursor: pointer;
  transition: border-color ${style.vars.transitionSpeed.base} ${style.vars.easeInOutCubic};

  & + & {
    margin-top: ${style.vars.space['3']};
  }

  &:hover {
    border-color: ${style.colors.primary.base};
  }
`;

const PlanContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['1']};
`;

const PlanName = styled.span`
  font-size: ${style.vars.fontSize.base};
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
`;

const PlanSpecs = styled.span`
  font-size: ${style.vars.fontSize.small};
  color: ${style.colors.primary.base};
`;

const PlanDisk = styled.span`
  font-size: ${style.vars.fontSize.small};
  color: ${style.colors.grey.dark};
`;

const DottedLink = styled.span`
  border-bottom: ${style.vars.borderWidth.thin} dotted ${style.colors.grey.dark};
`;

const PlanPrice = styled.span`
  font-size: ${style.vars.fontSize.base};
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
  flex-shrink: 0;
  white-space: nowrap;
`;

// --- Checkbox Section ---

const CheckboxCard = styled.div`
  border: ${style.vars.borderWidth.thin} solid ${style.colors.grey.light};
  border-radius: ${style.vars.borderRadius.base};
  padding: ${style.vars.space['4']};
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['1']};
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${style.vars.space['2']};
`;

const CheckboxLabel = styled.span`
  font-size: ${style.vars.fontSize.base};
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
`;

const CheckboxDesc = styled.span`
  font-size: ${style.vars.fontSize.small};
  color: ${style.colors.grey.dark};
  padding-left: calc(20px + ${style.vars.space['2']});
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const CheckboxBox = styled.div<{ $checked?: boolean }>`
  width: 18px;
  height: 18px;
  border: ${style.vars.borderWidth.base} solid ${(p) => p.$checked ? style.colors.primary.base : style.colors.grey.dark};
  border-radius: ${style.vars.borderRadius.base};
  background: ${(p) => p.$checked ? style.colors.primary.base : style.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: background ${style.vars.transitionSpeed.base} ${style.vars.easeInOutCubic},
    border-color ${style.vars.transitionSpeed.base} ${style.vars.easeInOutCubic};
`;

const CheckMark = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function CustomCheckbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <CheckboxRow as="label" style={{ cursor: 'pointer' }}>
      <HiddenCheckbox checked={checked} onChange={onChange} />
      <CheckboxBox $checked={checked}>
        {checked && <CheckMark />}
      </CheckboxBox>
      <CheckboxLabel>{label}</CheckboxLabel>
    </CheckboxRow>
  );
}

// --- Summary Sidebar ---

const SummaryCardWrapper = styled.div`
  border: ${style.vars.borderWidth.thin} solid ${style.colors.grey.light};
  border-radius: ${style.vars.borderRadius.base};
  background: ${style.colors.white};
  overflow: hidden;
`;

const SummaryHeader = styled.div`
  padding: ${style.vars.space['4']};
  font-size: ${style.vars.fontSize.base};
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
  border-bottom: ${style.vars.borderWidth.thin} solid ${style.colors.grey.light};
`;

const SummaryBody = styled.div`
  padding: ${style.vars.space['4']};
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['4']};
`;

const SummaryInfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${style.vars.space['2']};
  font-size: ${style.vars.fontSize.small};
  color: ${style.colors.grey.darkest};
`;

const SummaryLineItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${style.vars.space['3']};
  padding: ${style.vars.space['4']};
`;

const SummaryLineIcon = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SummaryLineContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['1']};
`;

const SummaryLineTitle = styled.span`
  font-size: ${style.vars.fontSize.small};
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
`;

const SummaryLineDetail = styled.span`
  font-size: ${style.vars.fontSize.xsmall};
  color: ${style.colors.grey.dark};
  line-height: 1.5;
`;

const SummaryLinePrice = styled.span`
  font-size: ${style.vars.fontSize.small};
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
  flex-shrink: 0;
  white-space: nowrap;
`;

const SummaryDivider = styled.div`
  border-top: ${style.vars.borderWidth.thin} dashed ${style.colors.grey.light};
  margin: 0 ${style.vars.space['4']};
`;

const SummaryTotalRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: ${style.vars.space['4']};
  border-top: ${style.vars.borderWidth.thin} dashed ${style.colors.grey.light};
`;

const SummaryTotalLabel = styled.span`
  font-size: ${style.vars.fontSize.small};
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
`;

const SummaryTotalPrice = styled.span`
  font-size: ${style.vars.fontSize.base};
  font-weight: ${style.vars.fontWeight.bolder};
  color: ${style.colors.grey.darkest};
`;

const SummaryTotalUnit = styled.span`
  font-size: ${style.vars.fontSize.small};
  font-weight: ${style.vars.fontWeight.base};
  color: ${style.colors.grey.dark};
`;

const SummaryWarning = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${style.vars.space['2']};
  padding: ${style.vars.space['3']};
  background: #fff0f3;
  border-radius: ${style.vars.borderRadius.base};
  font-size: ${style.vars.fontSize.xsmall};
  color: ${style.colors.grey.darkest};
  line-height: 1.5;
`;

const WarningLink = styled.a`
  color: ${style.colors.primary.base};
  font-weight: ${style.vars.fontWeight.bold};
  cursor: pointer;
`;

const GpuSummaryIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="20" height="16" rx="2" stroke={style.colors.primary.base} strokeWidth="1.5" fill="none" />
    <rect x="8" y="10" width="6" height="4" rx="1" stroke={style.colors.primary.base} strokeWidth="1" fill="none" />
    <rect x="8" y="16" width="6" height="2" rx="0.5" fill={style.colors.primary.base} />
    <circle cx="19" cy="17" r="1" fill={style.colors.primary.base} />
    <line x1="9" y1="4" x2="9" y2="6" stroke={style.colors.primary.base} strokeWidth="1.5" />
    <line x1="14" y1="4" x2="14" y2="6" stroke={style.colors.primary.base} strokeWidth="1.5" />
    <line x1="19" y1="4" x2="19" y2="6" stroke={style.colors.primary.base} strokeWidth="1.5" />
  </svg>
);

const VolumeSummaryIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="14" cy="8" rx="8" ry="3" stroke={style.colors.primary.base} strokeWidth="1.5" fill="none" />
    <path d="M6 8v6c0 1.66 3.58 3 8 3s8-1.34 8-3V8" stroke={style.colors.primary.base} strokeWidth="1.5" fill="none" />
    <path d="M6 14v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke={style.colors.primary.base} strokeWidth="1.5" fill="none" />
  </svg>
);

const BackupSummaryIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 4C8.48 4 4 8.48 4 14s4.48 10 10 10 10-4.48 10-10" stroke={style.colors.primary.base} strokeWidth="1.5" fill="none" />
    <path d="M20 4l2 4 4-2" stroke={style.colors.primary.base} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M14 9v5l3 3" stroke={style.colors.primary.base} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WarningCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke="#e6394a" strokeWidth="1.5" fill="none" />
    <path d="M8 5v4" stroke="#e6394a" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11.5" r="0.75" fill="#e6394a" />
  </svg>
);

const ApiCard = styled.div`
  border: ${style.vars.borderWidth.thin} solid ${style.colors.grey.light};
  border-radius: ${style.vars.borderRadius.base};
  padding: ${style.vars.space['4']};
  background: #fff0f3;
  display: flex;
  gap: ${style.vars.space['3']};
  align-items: flex-start;
`;

const ApiCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${style.vars.space['1']};
`;

const ApiCardTitle = styled.span`
  font-size: ${style.vars.fontSize.small};
  font-weight: ${style.vars.fontWeight.bold};
  color: ${style.colors.grey.darkest};
`;

const ApiCardText = styled.span`
  font-size: ${style.vars.fontSize.xsmall};
  color: ${style.colors.grey.dark};
  line-height: 1.5;
`;

const ApiCardLink = styled.a`
  color: ${style.colors.primary.base};
  font-size: ${style.vars.fontSize.xsmall};
  cursor: pointer;
`;

const ShowAllLink = styled.a`
  color: ${style.colors.primary.base};
  font-size: ${style.vars.fontSize.small};
  font-weight: ${style.vars.fontWeight.bold};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

// --- Page Component ---

export default function DatabaseCreate() {
  const [region, setRegion] = React.useState<{ label: string; value: string } | undefined>(REGIONS[0]);
  const [selectedImage, setSelectedImage] = React.useState('aiml');
  const [gpuPlatform, setGpuPlatform] = React.useState('nvidia');
  const [gpuPlanTab, setGpuPlanTab] = React.useState(0);
  const [selectedPlan, setSelectedPlan] = React.useState('h200x8');
  const [backups, setBackups] = React.useState(false);
  const [volumes, setVolumes] = React.useState(false);

  const currentPlanTabName = GPU_PLAN_TABS[gpuPlanTab];
  const currentPlans = GPU_PLANS[currentPlanTabName] || [];

  const selectedPlanData = findPlanById(selectedPlan);
  const gpuHourly = selectedPlanData?.pricePerHr ?? 0;
  const backupHourly = backups ? BACKUP_HOURLY : 0;
  const volumeHourly = volumes ? VOLUME_HOURLY : 0;
  const totalHourly = gpuHourly + backupHourly + volumeHourly;

  return (
    <PageLayout>
      <MainColumn>
        {/* Page Header */}
        <PageTitle>Create GPU Droplet</PageTitle>

        {/* Out of Stock Banner */}
        <BannerWrapper>
          <BannerImage>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="15" width="40" height="30" rx="3" stroke="#4a7ab5" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
              <rect x="18" y="22" width="10" height="8" rx="1" stroke="#4a7ab5" strokeWidth="1" fill="none" />
              <circle cx="40" cy="35" r="5" stroke="#4a7ab5" strokeWidth="1" fill="none" />
              <path d="M38 35l2 2 3-4" stroke="#4a7ab5" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </BannerImage>
          <BannerContent>
            <BannerTitle>We're out of GPU's right now.</BannerTitle>
            <BannerText>
              Try again later, or skip the wait by reserving GPU servers with a 12-month plan—guaranteed availability and as low as $2.50 per GPU/hour.
            </BannerText>
            <div>
              <Button variation="secondary" compact>Talk with Sales for pricing details</Button>
            </div>
          </BannerContent>
        </BannerWrapper>

        {/* Region Selector */}
        <Section>
          <SectionTitle>Choose a datacenter region</SectionTitle>
          <RegionDropdownWrapper>
            <SelectMenu
              items={REGIONS}
              selection={region}
              setSelection={setRegion}
              placeholder="Select a region"
            />
          </RegionDropdownWrapper>
          <RegionSubtext>GPUs in this datacenter are currently unavailable</RegionSubtext>
        </Section>

        {/* Choose an Image */}
        <Section>
          <SectionTitle>Choose an image</SectionTitle>
          <TabbedContent defaultIndex={0}>
            <TabList>
              <Tab>OS</Tab>
              <Tab>1-click Models</Tab>
              <Tab>Custom Images (1)</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <RadioCardList>
                  {OS_IMAGES.map((img) => (
                    <RadioCard
                      key={img.id}
                      $selected={selectedImage === img.id}
                      onClick={() => setSelectedImage(img.id)}
                    >
                      <HiddenRadio
                        type="radio"
                        name="os-image"
                        value={img.id}
                        checked={selectedImage === img.id}
                        onChange={() => setSelectedImage(img.id)}
                      />
                      <RadioDot $selected={selectedImage === img.id} />
                      <RadioCardIcon>
                        {(img.id === 'aiml' || img.id === 'inference') && <SparkleIcon />}
                        {img.id === 'ubuntu' && <UbuntuIcon />}
                        {img.id === 'fedora' && <FedoraIcon />}
                      </RadioCardIcon>
                      <RadioCardContent>
                        <RadioCardTitle>{img.name}</RadioCardTitle>
                        {img.description && (
                          <RadioCardDesc>
                            {img.description}
                            {img.link && (
                              <>
                                {' '}
                                <RadioCardLink href="#">required GPU Drivers ↗</RadioCardLink>
                              </>
                            )}
                          </RadioCardDesc>
                        )}
                      </RadioCardContent>
                      {img.version && (
                        <RadioCardRight>
                          {img.version} <ChevronDownSmall />
                        </RadioCardRight>
                      )}
                    </RadioCard>
                  ))}
                </RadioCardList>
                <ShowAllLink href="#">Show all OS images</ShowAllLink>
              </TabPanel>
              <TabPanel>
                <SectionSubtext>1-click model marketplace coming soon.</SectionSubtext>
              </TabPanel>
              <TabPanel>
                <SectionSubtext>1 custom image available.</SectionSubtext>
              </TabPanel>
            </TabPanels>
          </TabbedContent>
        </Section>

        {/* GPU Platform */}
        <Section>
          <SectionTitle>GPU Platform</SectionTitle>
          <PlatformRow>
            <PlatformOption
              $selected={gpuPlatform === 'nvidia'}
              onClick={() => setGpuPlatform('nvidia')}
            >
              <HiddenRadio
                type="radio"
                name="gpu-platform"
                value="nvidia"
                checked={gpuPlatform === 'nvidia'}
                onChange={() => setGpuPlatform('nvidia')}
              />
              <RadioDot $selected={gpuPlatform === 'nvidia'} />
              NVIDIA
            </PlatformOption>
            <PlatformOption
              $selected={gpuPlatform === 'amd'}
              onClick={() => setGpuPlatform('amd')}
            >
              <HiddenRadio
                type="radio"
                name="gpu-platform"
                value="amd"
                checked={gpuPlatform === 'amd'}
                onChange={() => setGpuPlatform('amd')}
              />
              <RadioDot $selected={gpuPlatform === 'amd'} />
              AMD
            </PlatformOption>
          </PlatformRow>
        </Section>

        {/* Choose a GPU Plan */}
        <Section>
          <SectionTitle>Choose a GPU Plan</SectionTitle>
          <TabbedContent defaultIndex={0} onChange={(index: number) => setGpuPlanTab(index)}>
            <TabList>
              {GPU_PLAN_TABS.map((tab) => (
                <Tab key={tab}>{tab}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {GPU_PLAN_TABS.map((tabName) => (
                <TabPanel key={tabName}>
                  <SectionTitle>GPU Plans</SectionTitle>
                  {(GPU_PLANS[tabName] || []).map((plan) => (
                    <PlanCard
                      key={plan.id}
                      $selected={selectedPlan === plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <HiddenRadio
                        type="radio"
                        name="gpu-plan"
                        value={plan.id}
                        checked={selectedPlan === plan.id}
                        onChange={() => setSelectedPlan(plan.id)}
                      />
                      <RadioDot $selected={selectedPlan === plan.id} />
                      <PlanContent>
                        <PlanName>{plan.name}</PlanName>
                        <PlanSpecs>{plan.specs}</PlanSpecs>
                        <PlanDisk>
                          <DottedLink>Boot disk: {plan.bootDisk}</DottedLink>
                          {' - '}
                          <DottedLink>Scratch disk: {plan.scratchDisk}</DottedLink>
                        </PlanDisk>
                      </PlanContent>
                      <PlanPrice>{plan.price}</PlanPrice>
                    </PlanCard>
                  ))}
                </TabPanel>
              ))}
            </TabPanels>
          </TabbedContent>
        </Section>

        {/* Backups */}
        <Section>
          <SectionTitle>Backups</SectionTitle>
          <CheckboxCard>
            <CustomCheckbox
              checked={backups}
              onChange={() => setBackups(!backups)}
              label="Enable automated backups"
            />
            <CheckboxDesc>Take full server backups at the time you specify</CheckboxDesc>
          </CheckboxCard>
        </Section>

        {/* Volumes Block Storage */}
        <Section>
          <SectionTitle>Volumes Block Storage</SectionTitle>
          <CheckboxCard>
            <CustomCheckbox
              checked={volumes}
              onChange={() => setVolumes(!volumes)}
              label="Add additional storage"
            />
            <CheckboxDesc>
              Volumes are NVMe network block storage. You can use them to move between Droplets and GPU Droplets by detaching and attaching at any time.
            </CheckboxDesc>
          </CheckboxCard>
        </Section>
      </MainColumn>

      {/* Summary Sidebar */}
      <SidebarColumn>
        <SummaryCardWrapper>
          <SummaryHeader>Summary</SummaryHeader>

          {/* GPU Line Item */}
          {selectedPlanData && (
            <>
              <SummaryLineItem>
                <SummaryLineIcon><GpuSummaryIcon /></SummaryLineIcon>
                <SummaryLineContent>
                  <SummaryLineTitle>GPU</SummaryLineTitle>
                  <SummaryLineDetail>Type: {selectedPlanData.name}</SummaryLineDetail>
                  <SummaryLineDetail>GPU: {selectedPlanData.gpuCount}</SummaryLineDetail>
                  <SummaryLineDetail>VRAM: {selectedPlanData.vram}</SummaryLineDetail>
                  <SummaryLineDetail>vCPU: {selectedPlanData.vcpu}</SummaryLineDetail>
                  <SummaryLineDetail>RAM: {selectedPlanData.ram}</SummaryLineDetail>
                  <SummaryLineDetail>Boot Disk: {selectedPlanData.bootDisk} SSD</SummaryLineDetail>
                </SummaryLineContent>
                <SummaryLinePrice>${selectedPlanData.pricePerHr.toFixed(2)}/hr</SummaryLinePrice>
              </SummaryLineItem>
              <SummaryDivider />
            </>
          )}

          {/* Volume Block Storage Line Item */}
          {volumes && (
            <>
              <SummaryLineItem>
                <SummaryLineIcon><VolumeSummaryIcon /></SummaryLineIcon>
                <SummaryLineContent>
                  <SummaryLineTitle>Volume Block Storage</SummaryLineTitle>
                  <SummaryLineDetail>NVMe SSD: 100 GB</SummaryLineDetail>
                </SummaryLineContent>
                <SummaryLinePrice>${VOLUME_HOURLY.toFixed(3)}/hr</SummaryLinePrice>
              </SummaryLineItem>
              <SummaryDivider />
            </>
          )}

          {/* Backups Line Item */}
          {backups && (
            <>
              <SummaryLineItem>
                <SummaryLineIcon><BackupSummaryIcon /></SummaryLineIcon>
                <SummaryLineContent>
                  <SummaryLineTitle>Weekly Backups</SummaryLineTitle>
                  <SummaryLineDetail>Each backup is kept for 28 days, billing starts after the first backup</SummaryLineDetail>
                </SummaryLineContent>
                <SummaryLinePrice>${BACKUP_HOURLY.toFixed(2)}/hr</SummaryLinePrice>
              </SummaryLineItem>
              <SummaryDivider />
            </>
          )}

          {/* Total Cost */}
          <SummaryTotalRow>
            <SummaryTotalLabel>Total cost</SummaryTotalLabel>
            <div>
              <SummaryTotalPrice>${totalHourly.toFixed(totalHourly < 1 ? 3 : 2)}</SummaryTotalPrice>
              <SummaryTotalUnit>/hour</SummaryTotalUnit>
            </div>
          </SummaryTotalRow>
        </SummaryCardWrapper>

        <Button variation="primary" fullWidth>
          Create GPU Droplet
        </Button>

        <SummaryWarning>
          <WarningCircleIcon />
          <span>Your current limit does not allow creating a GPU Droplet. <WarningLink href="#">Request Access</WarningLink></span>
        </SummaryWarning>

        <ApiCard>
          <ApiCardContent>
            <ApiCardTitle>Want to maximize efficiency and cost?</ApiCardTitle>
            <ApiCardText>
              Programmatically manage GPUs in a repeatable and re-usable way with our API.{' '}
              <ApiCardLink href="#">Create via API</ApiCardLink>
            </ApiCardText>
          </ApiCardContent>
        </ApiCard>
      </SidebarColumn>
    </PageLayout>
  );
}
