import { Skeleton } from "primereact/skeleton";
import { FC } from "react";

interface IProps {}

const TaskOverviewSkeleton: FC<IProps> = () => {
    return (
        <div className="grid mt-2">
            <div className="col-12 md:col-6 xl:col-4">
                <Skeleton height="214px" />
            </div>
            <div className="col-12 md:col-6 xl:col-4">
                <Skeleton height="214px" />
            </div>
            <div className="col-12 md:col-6 xl:col-4">
                <Skeleton height="214px" />
            </div>
            <div className="col-12 md:col-6 xl:col-4">
                <Skeleton height="214px" />
            </div>
            <div className="col-12 md:col-6 xl:col-4">
                <Skeleton height="214px" />
            </div>
            <div className="col-12 md:col-6 xl:col-4">
                <Skeleton height="214px" />
            </div>
            <div className="col-12 md:col-6 xl:col-4">
                <Skeleton height="214px" />
            </div>
            <div className="col-12 md:col-6 xl:col-4">
                <Skeleton height="214px" />
            </div>
            <div className="col-12 md:col-6 xl:col-4">
                <Skeleton height="214px" />
            </div>
            <div className="col-12 md:col-6 xl:col-4">
                <Skeleton height="214px" />
            </div>
            <div className="col-12 md:col-6 xl:col-4">
                <Skeleton height="214px" />
            </div>
            <div className="col-12 md:col-6 xl:col-4">
                <Skeleton height="214px" />
            </div>
        </div>
    );
};

export default TaskOverviewSkeleton;
