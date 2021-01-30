import { Button } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
import Checkbox from 'components/Checkbox';
import {
  createStore,
  StateMachineProvider,
  useStateMachine,
} from 'little-state-machine';
import { cacheAllPage, cacheSelect, clearCache } from 'machine/cache-select';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

let renderCount = 0;

export const size = 5;

createStore({
  selected: [],
});

interface IAbstractResponse {
  id: string;
  createdDate: string;
  lastModifiedDate: string;
}

interface IUserResponse extends IAbstractResponse {
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  isDeleted: boolean;
  phone: string;
  role: string;
}

interface ITaskResponse extends IAbstractResponse {
  name: string;
  description: string;
  startEstimateTime: string;
  endEstimateTime: string;
  assignees: IUserResponse[];
  previous: string;
  priority: string;
  progress: number;
  taskStatus: ITaskStatusResponse;
  taskStatusId: string;
  type: string;
}

interface ITaskStatusResponse extends IAbstractResponse {
  type: string;
  description: string;
  deleted: boolean;
  previous: string;
}

interface IMetadata {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemCount: number;
  page: number;
  pageCount: number;
  take: number;
}

const YourComponent: FC<{}> = () => {
  const { state, actions } = useStateMachine({
    cacheAllPage,
    cacheSelect,
    clearCache,
  });

  const { control, setValue, handleSubmit } = useForm();

  console.log('=================================================');

  // console.log('watchAllFields:', watchAllFields);
  // console.log('getSelected:', getSelected);

  console.log('Global Cache State:', state);

  const [tasks, setTasks] = useState<{
    data: ITaskResponse[];
    meta: IMetadata;
  }>({
    data: [],
    meta: {
      hasNextPage: false,
      hasPreviousPage: false,
      itemCount: 0,
      page: 1,
      pageCount: 0,
      take: size,
    },
  });
  const selectedItem = state.selected.find((x) => x.page === tasks.meta.page);
  console.log('selectedItem:', selectedItem);

  const getTasks = useCallback(async (newQueryAttr?: Record<string, any>) => {
    try {
      const params = { take: size };

      const res = await axios.get(`http://183.81.32.36:8000/task`, {
        params: { ...params, ...newQueryAttr },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      setTasks(res.data);
    } catch (error) {
      console.log('Error:', error);
    }
  }, []);

  useEffect(() => {
    getTasks({ take: size });
  }, [getTasks]);

  const handleCache = (id: string) => {
    try {
      actions.cacheSelect({
        page: tasks.meta.page,
        size: tasks.data.length,
        rowId: id,
      });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleCachePage = () => {
    try {
      const rowIds = tasks.data.map((e) => e.id);
      actions.cacheAllPage({ page: tasks.meta.page, rowIds });
    } catch (error) {}
  };

  const handleClearCache = () => {
    actions.clearCache([]);
  };

  const onSubmit = (data: Record<string, any>) => {
    console.log('Data:', data);
  };

  console.log('=================================================');
  renderCount++;

  return (
    <>
      <div>Render Count: {renderCount}</div>

      <Checkbox
        name="check-all"
        defaultChecked={selectedItem?.selectAll}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const checked = e.target.checked;
          tasks.data
            .map((e) => e.id)
            .forEach((element) => {
              setValue(element, checked);
            });
          handleCachePage();
        }}
      />

      {tasks.data.map((e) => (
        <Controller
          key={e.id}
          name={e.id}
          control={control}
          defaultValue={selectedItem?.rowIds.includes(e.id) || false}
          render={(props) => {
            return (
              <Checkbox
                name={props.name}
                defaultChecked={selectedItem?.rowIds.includes(e.id)}
                label={e.name}
                ref={props.ref}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const checked = e.target.checked;

                  props.onChange(checked);
                  handleCache(props.name);
                }}
              />
            );
          }}
        />
      ))}

      <Button onClick={handleSubmit(onSubmit)}>Submit Form</Button>

      <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
        <Button onClick={() => getTasks({ page: tasks.meta.page - 1 })}>
          Previous Page
        </Button>
        <Button disabled style={{ margin: '0 5px' }}>
          {tasks.meta.page}
        </Button>
        <Button onClick={() => getTasks({ page: tasks.meta.page + 1 })}>
          Next Page
        </Button>
      </div>

      <Button onClick={handleClearCache}>Reset Cache</Button>
    </>
  );
};

const App = () => {
  return (
    <StateMachineProvider>
      <YourComponent />
    </StateMachineProvider>
  );
};

export default App;
