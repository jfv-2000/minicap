import { Button, Box, Heading, UseToastOptions, useToast, SimpleGrid, Text } from "@chakra-ui/react";
import PatientInputs from "@frontend/components/inputs/unit-input";
import PatientTextarea from "@frontend/components/inputs/patient-textarea-input";
import { pastConditionsProps, statusFilled, StatusParameters } from "@frontend/functions/create-status";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { allFieldsFilled, validIntegerField } from "@frontend/functions/validation";
import { patientSymptoms, registerIntegerErrorPopup } from "@frontend/utils/popups";
import PatientCard from "./patient-card";
import { useRouter } from "next/router";
import { checkboxForms } from "@frontend/functions/checkbox-form";
import { PatientsFormsToFill } from "./types/types";

export default function PatientFormToFill({ requiredDetails, pastConditions }: PatientsFormsToFill) {
    // initialize constants
    const router = useRouter();
    const { Temperature: temperature, Weight: weight, Symptoms: symptoms } = requiredDetails;
    const [weightError, setWeightError] = useState(false);
    const [temperatureError, setTemperatureError] = useState(false);
    const toast = useToast();
    const callPopup = (props: UseToastOptions) => !toast.isActive("popup") && toast({ ...props, id: "popup" });

    const { data: session } = useSession();
    const userId = session?.user?.AccountId;

    // function to send data to backend and create new status
    async function handlePatientForm(event: any) {
        event.preventDefault();

        const time = moment().format("YYYY-MM-DD HH:mm:ss");
        let error = false;

        // initialize values for statusValues
        // TODO: decide on default value for weight
        const statusValues: StatusParameters = {
            accountId: userId,
            temperature: 37,
            weight: 0,
            symptoms: " ",
            isReviewed: false,
            statusTime: time,
        };

        const checkboxValues = checkboxForms(requiredDetails, event);
        const newStatusValues = { ...statusValues, ...checkboxValues };

        // Check for ERRORS
        // weight integer validation
        if (!validIntegerField(newStatusValues.weight)) {
            setWeightError(true);
            error = true;
        } else setWeightError(false);

        // temperature integer validation
        if (!validIntegerField(newStatusValues.temperature)) {
            setTemperatureError(true);
            error = true;
        } else setTemperatureError(false);

        console.log(statusValues);

        // popup if error
        if (error) {
            callPopup(registerIntegerErrorPopup);
        } else if (!allFieldsFilled(newStatusValues)) {
            callPopup(patientSymptoms);
        } else {
            try {
                const response = await statusFilled(newStatusValues);

                if (response) {
                    // change to another page function
                    (await router.push("/")) && toast.closeAll();

                    const data = await response.json();
                } else throw "Error";
            } catch (errr) {
                console.log("There was an error");
            }
        }
    }
    return (
        <>
            <Box paddingLeft={"20px"}>
                <Heading size="lg">Your Doctor: Dr Sawkon Di Zenoots</Heading>
                <Heading size="lg">Today's Condition</Heading>
                <Box w={{ base: "100%", md: "35%" }} paddingRight={"10px"}>
                    <form onSubmit={handlePatientForm}>
                    <Heading size="md" margin={"30px 0 10px 20px"}>Please fill out the following field for your doctor:</Heading>

                        {temperature && (
                            <PatientInputs
                                error={temperatureError}
                                label="Temperature"
                                units="°C"
                                name={"temperature"}
                            />
                        )}
                        {weight && <PatientInputs error={weightError} label="Weight" units="lbs" name={"weight"} />}
                        {symptoms && <PatientTextarea label="Symptoms" units="" name={"symptoms"} />}
                        <Text margin="0 0 10px 30px">(Please separate the symptoms with a comma)</Text>
                        <Button
                            colorScheme="pink"
                            size="md"
                            margin={"20px 0 0 20px"}
                            _hover={{ opacity: "80%" }}
                            type="submit">
                            Submit
                        </Button>
                    </form>
                </Box>

                <Heading margin={"30px"}>Previous Day's Conditions</Heading>

                <SimpleGrid minChildWidth="300px" rowGap={2} spacing={"20px"}>
                    {pastConditions.map(
                        ({
                            StatusTime: label,
                            Temperature: temperature,
                            Weight: weight,
                            Symptoms: symptoms,
                        }: pastConditionsProps) => {
                            label = label.substring(0, 10);

                            return (
                                <PatientCard
                                    key={label}
                                    label={label}
                                    temperature={temperature}
                                    weight={weight}
                                    symptoms={symptoms}
                                />
                            );
                        }
                    )}
                </SimpleGrid>
            </Box>
        </>
    );
}
