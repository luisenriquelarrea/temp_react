import { SeccionMenuInput } from "@/app/utils/entities";
import Table from "./Table";

interface NumericDataProps { 
    inputs: SeccionMenuInput[]; 
    dataTable: any[]; 
}
type RecordType = {
    status: number;
    [key: string]: any;
};

type InputType = {
    inputName: string;
};

const NumericData = ({ inputs, dataTable }: NumericDataProps) => {

    const filteredData = dataTable.filter(
        (record: RecordType) => record.status !== 0
    );

    const rows = filteredData.map((record: RecordType) => {
        const row: Record<string, any> = {};

        for (const { inputName } of inputs as InputType[]) {
            row[inputName] = record[inputName];
        }

        return row;
    });

    const totals = inputs.reduce<Record<string, number>>((acc, input) => {
        const key = input.inputName!;

        acc[key] = filteredData.reduce((sum, record) => {
            return sum + (Number(record[key]) || 0);
        }, 0);

        return acc;
    }, {});

    const data = [totals];

    return (
        <>
            {rows.length > 0 && (<div>
                <Table 
                    seccionMenu="tmpTable"
                    columns={inputs} 
                    dataTable={data}
                    tableActions={[]} />
            </div>)}
        </>
    );
};

export default NumericData;