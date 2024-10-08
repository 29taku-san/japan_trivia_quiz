import React, { FC, ReactNode } from 'react';

interface RadioGroupProps {
  children: ReactNode;
  onValueChange: (value: string) => void;
  value: string | undefined;
}

export const RadioGroup: FC<RadioGroupProps> = ({ children, onValueChange, value }) => {
  return (
    <div role="radiogroup">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // 子要素の型推論を強制し、適切なプロパティを渡します
          return React.cloneElement(child as React.ReactElement<{ onValueChange: (value: string) => void; selectedValue: string | undefined }>, { onValueChange, selectedValue: value });
        }
        return child;
      })}
    </div>
  );
};

interface RadioGroupItemProps {
  value: string;
  id: string;
  onValueChange: (value: string) => void;
  selectedValue: string | undefined;
}

export const RadioGroupItem: FC<RadioGroupItemProps> = ({ value, id, onValueChange, selectedValue }) => {
  const handleChange = () => {
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <input
      type="radio"
      id={id}
      name="radio-group"
      value={value}
      checked={selectedValue === value}  // 選択された値と比較
      onChange={handleChange}  // onChangeで値を変更
    />
  );
};
