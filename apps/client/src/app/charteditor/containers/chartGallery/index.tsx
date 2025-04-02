import { Button } from '@headlessui/react';
import CWModal from '../../../components/modal';
import { useAtom } from 'jotai';
import { chartGallery } from '../../../../store/charts';

interface IChartGallery {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSetChartViaGalleryOptions: (value: string) => void;
}

function ChartGallery(props: IChartGallery) {
  const { isOpen, setIsOpen, onSetChartViaGalleryOptions } = props;
  const [charts] = useAtom(chartGallery);

  return (
    <CWModal isOpen={isOpen} setIsOpen={setIsOpen} title="Chart Gallery">
      <div className=" mt-10 grid gap-4 grid-cols-3 max-h-96 overflow-auto">
        {charts.map((chart) => {
          return (
            <Button
              className="w-full h-40 max-w-full rounded-lg border border-primary-border p-2 relative"
              onClick={() => {
                onSetChartViaGalleryOptions(
                  String(chart['title']).toLowerCase().split(' ').join('-')
                );
                setIsOpen(false);
              }}
            >
              <img
                className="w-full h-full rounded-lg object-contain object-center"
                src={`api/chart/image/${chart['thumbnail']}`}
                alt={chart['title']}
                loading="lazy"
              />
              <div className="opacity-0 hover:opacity-100 absolute w-full h-full bg-black/50 top-0 left-0 flex items-center justify-center rounded-lg">
                <h4 className="text-xl text-center font-semibold text-white">
                  {chart['title']}
                </h4>
              </div>
            </Button>
          );
        })}
      </div>
    </CWModal>
  );
}

export default ChartGallery;
