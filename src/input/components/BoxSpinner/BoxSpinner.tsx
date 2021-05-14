import React from 'react';
import styles from './BoxSpinner.scss';
import classNames from 'classnames';
import { Box, Flex, Spinner } from '@sanity/ui';

type Props = {
    overlay?: boolean;
}

export const BoxSpinner: React.FunctionComponent<Props> = ({ overlay }) => {
    return (
        <Box
            padding={[4, 2]}
            className={classNames({
                [styles.overlay]: !!overlay,
            })}
        >
            <Flex align='center' justify="center" style={{ height: '100%', width: '100%' }}>
                <Spinner />
            </Flex>
        </Box>
    );
}