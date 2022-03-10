import { Box } from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import moment from "moment";
import { pastConditionsProps } from "@frontend/functions/create-status";

interface ChartProps{
    data: unknown[],
    w: number,
    h: number,
}

export default function Chart({ data, w , h }: ChartProps) {
    // fix date format
    data.forEach((d: unknown) => {
        (d as pastConditionsProps).StatusTime = moment((d as pastConditionsProps).StatusTime).format('L');
    })

    return (
        <Box w={{ base: "100%", md: "35%" }} h={"50%"} >
            <LineChart
                width={w}
                height={h}
                data={data}
                margin={{
                    top: 50,
                    right: 50,
                    left: 20,
                    bottom: 5,
                }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="StatusTime" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Weight" stroke="#82ca9d" />
            </LineChart>            
        </Box>
    );
}
