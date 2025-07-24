import React from 'react'
import styled from 'styled-components'

type NavItemProps = {
  label: string
  icon: React.ReactNode
  active: boolean
  onClick: () => void
}

const breakpoints = {
  sm: '600px',
  md: '900px',
  lg: '1200px'
};

const NavButton = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 3rem;
  transition: all 0.2s ease-in-out;
  color: ${({ $active }) => ($active ? '#000' : '#6b7280')};
  border-bottom: ${({ $active }) => ($active ? '2px solid #000' : '1px solid #ccc')};
  background: transparent;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }

  @media (max-width: ${breakpoints.sm}) {
  flex: 1;
  padding: 0.5rem 0;
  min-width: 0;
}

`

const Icon = styled.span`
  font-size: 1.5rem;
`

const Label = styled.span`
  font-size: 0.875rem;
`

const QuickNavigation = ({ label, icon, active, onClick }: NavItemProps) => {
  return (
    <NavButton onClick={onClick} $active={active}>
      <Icon>{icon}</Icon>
      <Label>{label}</Label>
    </NavButton>
  )
}

export default QuickNavigation
