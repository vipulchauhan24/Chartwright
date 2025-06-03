import IconButton from '../iconButton';
import CWTextInput from '../textInput';
import { useEffect, useState } from 'react';
import { Plus, Trash } from 'lucide-react';

interface ICWTableInput {
  id: string;
  defaultValue: Array<Array<number>>;
  onChange: (data: Array<Array<number>>) => void;
}

function CWTableInput(props: ICWTableInput) {
  const { id, defaultValue, onChange } = props;
  const [series, setSeries] = useState<
    { x: number; y: number; size: number }[]
  >([]);

  useEffect(() => {
    const srs: { x: number; y: number; size: number }[] = [];
    defaultValue.forEach((value: Array<number>) => {
      srs.push({ x: value[0], y: value[1], size: value[2] });
    });
    setSeries(srs);
  }, [defaultValue]);

  const onDelete = (indx: number) => {
    let srs = JSON.parse(JSON.stringify(series));
    srs.splice(indx, 1);
    srs = srs.map((s: { x: number; y: number; size: number }) => {
      return [s.x, s.y, s.size];
    });
    onChange(srs);
  };

  const onEdit = (value: string, key: 'x' | 'y' | 'size', indx: number) => {
    let srs = JSON.parse(JSON.stringify(series));
    if (value.length) {
      srs[indx][key] = parseInt(value);
    } else {
      srs[indx][key] = '';
    }
    srs = srs.map((s: { x: number; y: number; size: number }) => {
      return [s.x, s.y, s.size];
    });
    onChange(srs);
  };

  const onAdd = () => {
    let srs = JSON.parse(JSON.stringify(series));
    srs = srs.map((s: { x: number; y: number; size: number }) => {
      return [s.x, s.y, s.size];
    });
    srs.push([0, 0, 0]);
    onChange(srs);
  };

  return (
    <div className="flex flex-col items-end h-60 overflow-y-auto">
      <table id={id} className="w-full text-left table-auto min-w-max">
        <thead>
          <tr>
            <th className="border-b p-1 border-border">
              <p className="text-sm font-medium text-text-main">X-Axis</p>
            </th>
            <th className="border-b p-1 border-border">
              <p className="text-sm font-medium text-text-main">Y-Axis</p>
            </th>
            <th className="border-b p-1 border-border">
              <p className="text-sm font-medium text-text-main">Size</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {series.map(
            (value: { x: number; y: number; size: number }, indx: number) => {
              return (
                <tr key={`table-row-${indx}`}>
                  <td className="p-1 max-w-14">
                    <CWTextInput
                      defaultValue={`${value.x}`}
                      id={`edit-bubble-chart-x-data-${indx}`}
                      placeholder="Enter value here..."
                      onChange={(e: any) => {
                        onEdit(e.target.value, 'x', indx);
                      }}
                    />
                  </td>
                  <td className="p-1 max-w-14">
                    <CWTextInput
                      defaultValue={`${value.y}`}
                      id={`edit-bubble-chart-y-data-${indx}`}
                      placeholder="Enter value here..."
                      onChange={(e: any) => {
                        onEdit(e.target.value, 'y', indx);
                      }}
                    />
                  </td>
                  <td className="p-1 max-w-14">
                    <CWTextInput
                      defaultValue={`${value.size}`}
                      id={`edit-bubble-chart-size-data-${indx}`}
                      placeholder="Enter value here..."
                      onChange={(e: any) => {
                        onEdit(e.target.value, 'size', indx);
                      }}
                    />
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <IconButton
                        icon={<Trash className="size-4" aria-hidden={true} />}
                        onClick={() => {
                          onDelete(indx);
                        }}
                      />
                      {indx === series.length - 1 && (
                        <IconButton
                          icon={<Plus className="size-4" aria-hidden={true} />}
                          onClick={onAdd}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CWTableInput;
