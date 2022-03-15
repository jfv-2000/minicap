import { Box } from "@chakra-ui/react";
import Check from "../../public/svg/check-mark.svg";
import { useState } from "react";

interface AppProps {
    isColored: boolean;

    color: string;
    onClicking: () => void;
    isUnfillable?: string;
}

const CheckMark = ({ isColored, color, onClicking, isUnfillable }: AppProps) => {
    const [isFilled, setIsFilled] = useState(isColored);

    const clickHandler = () => {
        if (isUnfillable === "true") {
            onClicking();
            setIsFilled(!isFilled);
        } else if (isUnfillable === "false" && isFilled === false) {
            onClicking();
            setIsFilled(true);
        } else {
            return;
        }
    };

    return (
        <Box onClick={clickHandler}>
            <Check fill={isFilled ? color : "black"} />
        </Box>
    );
};

export default CheckMark;
