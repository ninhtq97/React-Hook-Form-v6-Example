import React, { ComponentProps, FC } from 'react';
import {
  CheckboxContainer,
  CheckboxLabel,
  HiddenCheckbox,
  Icon,
  StyledCheckbox,
} from './Styles';

const Checkbox: FC<ComponentProps<typeof HiddenCheckbox>> = React.forwardRef(
  (
    { className, label, defaultChecked = false, ...restProps },
    forwardedRef
  ) => {
    return (
      <CheckboxLabel>
        <CheckboxContainer className={className}>
          <HiddenCheckbox
            checked={defaultChecked}
            {...restProps}
            ref={forwardedRef}
          />
          <StyledCheckbox checked={defaultChecked}>
            <Icon viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </Icon>
          </StyledCheckbox>
        </CheckboxContainer>
        {label}
      </CheckboxLabel>
    );
  }
);

export default Checkbox;
