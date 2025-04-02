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
      <div className="mt-10 grid grid-cols-3 gap-6 max-h-96 overflow-auto">
        {charts.map((chart) => {
          return (
            <Button
              className="w-80 rounded-lg overflow-hidden bg-primary-background"
              onClick={() => {
                onSetChartViaGalleryOptions(
                  String(chart['title']).toLowerCase().split(' ').join('-')
                );
                setIsOpen(false);
              }}
            >
              <img
                className="w-full"
                src={`api/chart/image/${chart['thumbnail']}`}
                alt="Sunset in the mountains"
              />
              <h4 className="text-xl my-2 text-center">{chart['title']}</h4>
            </Button>
          );
        })}
      </div>
    </CWModal>
  );
}

export default ChartGallery;
