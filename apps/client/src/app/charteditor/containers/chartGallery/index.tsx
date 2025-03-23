import { Button } from '@headlessui/react';
import CWModal from '../../../components/modal';

interface IChartGallery {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChartGallery(props: IChartGallery) {
  const { isOpen, setIsOpen } = props;
  return (
    <CWModal isOpen={isOpen} setIsOpen={setIsOpen} title="Chart Gallery">
      <div className="mt-10 grid grid-cols-3 gap-6 max-h-96 overflow-auto">
        <Button className="w-80 rounded-lg overflow-hidden bg-primary-background">
          <img
            className="w-full"
            src="https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Sunset in the mountains"
          />
          <h4 className="text-xl my-2 text-center">Bar chart</h4>
        </Button>
      </div>
    </CWModal>
  );
}

export default ChartGallery;
