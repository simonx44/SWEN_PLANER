export class TaskTransformation {
    public static transformEffortToInternalFormat(effort: number) {
        if (typeof effort === "undefined" || Number.isNaN(effort)) {
            throw Error();
        }

        const hours = Math.floor(effort / 60);
        const minutes = effort % 60;

        const formatedHour = hours > 9 ? hours.toString() : `0${hours}`;
        const formatedMinutes = minutes > 9 ? minutes.toString() : `0${minutes}`;

        return `${formatedHour}:${formatedMinutes}`;
    }

    public static transformInternalEffortFormatToNumber(effort: string) {
        const parts = effort.split(":");

        if (parts.length !== 2) {
            throw Error();
        }

        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        return hours * 60 + minutes;
    }

    public static transformDate(date: string) {
        const parsedDate = Date.parse(date);
        if (Number.isNaN(parsedDate)) return "-";
        const { year, date: day, month } = this.timeConverter(parsedDate);
        return `${day}/${month}/${year}`;
    }

    public static getCurrentDate() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();

        console.log(`${yyyy}-${mm}-${dd}`);
        return `${yyyy}-${mm}-${dd}`;
    }

    public static getFormatDate(datum: string) {
        const today = new Date(datum);
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();

        return `${yyyy}-${mm}-${dd}`;
    }

    private static timeConverter(timestamp: number) {
        const a = new Date(timestamp);
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const year = a.getFullYear();
        const month = months[a.getMonth()];
        const date = a.getDate();
        const hour = a.getHours();
        const min = a.getMinutes();

        return {
            year,
            month,
            date,
            hour,
            min,
        };
    }
}
