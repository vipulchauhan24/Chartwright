import { useEffect } from 'react';
import CWModal from '../../../components/modal';
import { ExternalLink } from 'lucide-react';
import { myCharts } from '../../../../store/charts';
import { useAtom } from 'jotai';
import Spinner from '../../../components/spinner';
import { fetchMyCharts } from '../../../../service/chartsApi';
import { useNavigate } from 'react-router-dom';
import CWButton from '../../../components/button';
import { fetchFromLocalStorage } from '../../utils/lib';
import { LOCAL_STORAGE_KEYS } from '../../utils/constants';

interface IViewMyCharts {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ViewMyCharts(props: IViewMyCharts) {
  const { isOpen, setIsOpen } = props;
  const [charts] = useAtom(myCharts);
  const [, fetchCharts] = useAtom(fetchMyCharts);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = fetchFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
    if (userId) {
      fetchCharts(userId);
    }
  }, [fetchCharts]);

  const viewMyChart = (chartId: string) => {
    setIsOpen(false);
    navigate(`/chart/${chartId}`);
  };

  return (
    <CWModal isOpen={isOpen} setIsOpen={setIsOpen} title="My Charts">
      {!charts.length ? (
        <div className="py-10 px-40 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className=" mt-4 relative overflow-x-auto">
          <table className="w-full text-sm text-left text-primary-text">
            <thead className="text-xs uppercase bg-primary-background">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Chart Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Chart Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Created Date
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {charts.map((chart, indx) => {
                return (
                  <tr
                    key={`${chart['title']}-${indx}`}
                    className="bg-white border-b border-primary-border"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {chart['title']}
                    </th>
                    <td className="px-6 py-4">{chart['chart_type']}</td>
                    <td className="px-6 py-4">{chart['created_date']}</td>
                    <td className="px-6 py-4">
                      <CWButton
                        onClick={() => {
                          viewMyChart(chart['id']);
                        }}
                        label={
                          <>
                            View
                            <ExternalLink
                              className="size-4"
                              aria-hidden={true}
                            />
                          </>
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </CWModal>
  );
}

export default ViewMyCharts;
