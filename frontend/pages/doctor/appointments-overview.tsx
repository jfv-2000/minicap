import { Box, Button, Flex, Heading, useDisclosure, Text } from "@chakra-ui/react";
import NewAppointmentForm from "@frontend/components/forms/new-appointment-form";
import { BsCalendarPlus } from "react-icons/bs";
import PatientInfoModal from "@frontend/components/modal/modal";
import { getSession } from "next-auth/react";
import { Appointment, SECTION } from "@frontend/models/appointment";
import { USER_ROLES } from "@frontend/utils/constants";
import { serverURL } from "@frontend/config";
import AppointmentReminders from "@frontend/components/doctor/appointment-reminders";
import moment, { Moment } from "moment";
import { MinusIcon } from "@chakra-ui/icons";
import AppointmentCalendar from "@frontend/components/doctor/appointment-calendar";
import { PatientBasicInformation } from "@frontend/models/patient";

export async function getServerSideProps(context: any) {
    const session = await getSession(context);
    const userId = session?.user.AccountId;
    let appointmentAndPatientList: { appointmentList: Appointment[]; patientList: PatientBasicInformation[] } = {
        appointmentList: [],
        patientList: [],
    };
    try {
        if (session?.user.Role === USER_ROLES.doctor) {
            const appointmentListResponse: any = await fetch(
                serverURL + "/doctors/getAppointmentsAndPatients/" + userId
            );
            appointmentAndPatientList = await appointmentListResponse.json();
        }
    } catch {}
    return {
        props: {
            session,
            appointmentList: appointmentAndPatientList.appointmentList,
            patientList: appointmentAndPatientList.patientList,
            userId,
        },
    };
}
export default function AppointmentsOverview({
    appointmentList,
    patientList,
    userId,
}: {
    appointmentList: Appointment[];
    patientList: PatientBasicInformation[];
    userId: number;
}) {
    const { onOpen, isOpen, onClose } = useDisclosure();

    function sortAppointments(section: string): Appointment[] {
        const upcomingAppointments: Appointment[] = [];
        const pastAppointments: Appointment[] = [];
        let appointmentDate: Moment = moment();

        appointmentList.map((appointment: Appointment) => {
            appointmentDate = moment(
                `${appointment.date} ${appointment.time.substring(0, appointment.time.indexOf(" "))}`,
                "YYYY-MM-DD HH:mm"
            );
            if (appointmentDate.isBefore()) {
                pastAppointments.push(appointment);
            } else if (appointmentDate.isAfter()) {
                upcomingAppointments.push(appointment);
            }
        });
        if (section === SECTION.UPCOMING) return upcomingAppointments;
        else if (section === SECTION.PAST) return pastAppointments;
        return appointmentList;
    }
    return (
        <Box m={10}>
            <Heading>Appointments</Heading>
            <Flex>
                {/* Calendar */}
                <Box>
                    <AppointmentCalendar appointmentList={appointmentList} />
                </Box>
                {/* Legend */}
                <Box flex="1" h={650}>
                    <Box fontSize="lg" flex="1" h="10vh">
                        <Text>
                            <MinusIcon w={6} h={6} color="green.200" mr={3} /> Confirmed
                        </Text>
                        <Text flex="1">
                            <MinusIcon w={6} h={6} color="orange.200" mr={3} /> Pending
                        </Text>
                        <Text flex="1">
                            <MinusIcon w={6} h={6} color="red.200" mr={3} /> Denied
                        </Text>
                    </Box>
                    <Box h={600}>
                        {/* Upcoming appointments */}
                        <Box>
                            <Heading size="lg" my={6} display="inline-block">
                                Upcoming
                            </Heading>
                            <Button variant="ghost" onClick={onOpen} float="right">
                                <BsCalendarPlus style={{ width: "25px", height: "25px" }} />
                            </Button>
                            <Box h={250} overflowY="auto">
                                <AppointmentReminders
                                    appointmentList={sortAppointments(SECTION.UPCOMING)}
                                    section={SECTION.UPCOMING}
                                />
                            </Box>
                        </Box>
                        {/* Past appointments */}
                        <Box>
                            <Heading size="lg" mt={6} mb={4}>
                                Past
                            </Heading>
                            <Box h={175} overflowY="auto">
                                <AppointmentReminders
                                    appointmentList={sortAppointments(SECTION.PAST)}
                                    section={SECTION.PAST}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Flex>
            <PatientInfoModal isOpen={isOpen} onClose={onClose}>
                <NewAppointmentForm userId={userId} patientList={patientList} appointmentList={appointmentList} />
            </PatientInfoModal>
        </Box>
    );
}
