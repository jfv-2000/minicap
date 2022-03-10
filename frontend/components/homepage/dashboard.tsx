import { Box, Center, Flex, Heading } from "@chakra-ui/react";
import Card from "./card";
import { links, link } from "@frontend/components/homepage/dashboard-structure";
import { useSession } from "next-auth/react";
import DashboardCharts from "@frontend/components/homepage/dashboard-charts";

export default function Dashboard({ data }: { data: unknown[] }) {
    const { data: session } = useSession();
    const userRole = session?.user?.Role;
    const userName = session?.user?.FirstName + " " + session?.user?.LastName;
    // depending on the role, will render different box for different functionalities
    return (
        <>
            <Box>
                <Heading paddingLeft={"50px"}>
                    Welcome {userRole} {userName}
                </Heading>
                <Center marginTop={"5%"}>
                    <Flex flexDirection={{ base: "column", md: "row" }}>
                        <DashboardCharts role={userRole} data={data} />

                        <Flex flexWrap="wrap">
                            {links.map(({ label, url, roleRequired, img }: link) => {
                                const renderCard = roleRequired === userRole || !roleRequired;
                                return renderCard && <Card key={label} label={label} image={img} url={url} />;
                            })}
                        </Flex>
                    </Flex>
                </Center>
            </Box>
        </>
    );
}
