import { HeaderContainer} from './styles'
import { Timer, Scroll } from 'phosphor-react'

import logoig from '../../assets/logoig.svg'
import { NavLink } from 'react-router-dom'

export function Header(){
    return (
        <HeaderContainer>
            <img src={logoig} alt="" />
            <nav>
                <NavLink to="/" end title='Tempo'>
                    <Timer size={24} />
                </NavLink>
                <NavLink to="/history" title='histórico'>
                    <Scroll size={24} />
                </NavLink>
            </nav>
        </HeaderContainer>
    )
}