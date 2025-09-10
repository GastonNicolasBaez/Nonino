import { GridLoader } from 'react-spinners'
import {
    Heading,
    Center
} from '@chakra-ui/react'

const Loading = () => {
    return (
        <Center h={'vh'} w={'vw'} flexDirection={'column'} gap="10">
            <Heading size={'2xl'}>
                Conectando...
            </Heading>
            <GridLoader
                color="#8f8f8fff"
                loading={true}
                size={15}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </Center>
    )
}

export default Loading