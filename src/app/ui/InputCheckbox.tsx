import { useState, useEffect } from 'react';

import { SeccionMenuInput } from '@/app/utils/entities';
interface InputCheckboxProps {
    text: string;
    inputData: SeccionMenuInput;
    stateFormData: React.Dispatch<React.SetStateAction<any>>;
    noLabel?: boolean;
    handleChange?: (value: number) => void;
}

const InputCheckbox = (props: InputCheckboxProps) => {
    const parseChecked = (value?: string): boolean => {
        return Number(value) === 1;
    };

    const [checked, setChecked] = useState<boolean>(
        parseChecked(props.text)
    );

    useEffect(() => {
        setChecked(parseChecked(props.text));
    }, [props.text]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        const value = isChecked ? 1 : 0;

        setChecked(isChecked);

        props.stateFormData((prev: any) => ({
            ...prev,
            [props.inputData.inputName!]: value
        }));

        props.handleChange?.(value);
    };

    return (
        <div className="column is-12">
            <label className="checkbox label">
                <input
                    className="my-check"
                    type="checkbox"
                    name={props.inputData.inputName}
                    checked={checked}
                    onChange={handleChange} />
                {!props.noLabel && props.inputData.inputLabel}
            </label>
        </div>
    );
};

export default InputCheckbox;