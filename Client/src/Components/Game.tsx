import * as signalR from '@microsoft/signalr'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { IGameState } from '../Interfaces/IGameState'
import { CardLocationType, ICard, IMovedCardPos, IPos, IRenderableCard } from '../Interfaces/ICard'
import styled from 'styled-components'
import Player from './Player'
import GameBoardLayout from '../Helpers/GameBoardLayout'
import Card from './Card'
import { LayoutGroup, PanInfo } from 'framer-motion'
import { clamp } from '../Helpers/Utilities'
import GameBoard from './GameBoard'

interface Props {
	connection: signalR.HubConnection | undefined
	connectionId: string | undefined | null
	gameState: IGameState
}

const getGameBoardDimensions = () => {
	return {
		X: clamp(window.innerWidth, 0, GameBoardLayout.maxWidth),
		Y: window.innerHeight,
	} as IPos;
}

const Game = ({ connection, connectionId, gameState }: Props) => {
	const [movedCards, setMovedCards] = useState<IMovedCardPos[]>([])
	const [gameBoardDimensions, setGameBoardDimensions] = useState<IPos>(getGameBoardDimensions())

	useLayoutEffect(() => {
		function UpdateGameBoardDimensions() {
			setGameBoardDimensions(getGameBoardDimensions)
		}

		UpdateGameBoardDimensions()
		window.addEventListener('resize', UpdateGameBoardDimensions)
		return () => window.removeEventListener('resize', UpdateGameBoardDimensions)
	}, [])



	useEffect(() => {
		if (!connection) return
		connection.on('CardMoved', CardMoved)

		return () => {
			connection.off('CardMoved', CardMoved)
		}
	}, [connection])

	const CardMoved = (data: any) => {
		let parsedData: IMovedCardPos = JSON.parse(data)

		let existingMovingCard = movedCards.find((c) => c.cardId === parsedData.cardId)
		if (existingMovingCard) {
			existingMovingCard.pos = parsedData.pos
		} else {
			movedCards.push(parsedData)
		}
		setMovedCards([...movedCards])
	}

	const OnPlayCard = (topCard: ICard, centerPileIndex: number) => {
		// Call the event
		connection?.invoke('TryPlayCard', topCard.Id, centerPileIndex).catch((e) => console.log(e))

		// Show any messages (Move to a warnings component)

		// assume the server will return success and update the gamestate
	}

	const OnPickupFromKitty = () => {
		// Call the event
		connection?.invoke('TryPickupFromKitty').catch((e) => console.log(e))
		// Show any messages (Move to a warnings component)
		// assume the server will return success and update the gamestate
	}

	const OnRequestTopUp = () => {
		// Call the event
		connection?.invoke('TryRequestTopUp').catch((e) => console.log(e))
		// Show any messages (Move to a warnings component)
		// assume the server will return success and update the gamestate
	}

	return (
		<GameContainer>
			<Player key={`player-${gameState.Players[0].Id}`} player={gameState.Players[0]} onTop={true} />
			<GameBoard
				playerId={connectionId}
				gameState={gameState}
				movedCards={movedCards}
				gameBoardDimensions={gameBoardDimensions}
				onPlayCard={OnPlayCard}
				onPickupFromKitty={OnPickupFromKitty}
			/>
			<Player
				onRequestTopUp={OnRequestTopUp}
				key={`player-${gameState.Players[1].Id}`}
				player={gameState.Players[1]}
				onTop={false}
			/>
			<Background key={'bg'} />
		</GameContainer>
	)
}

const GameContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	max-width: 100%;
	max-height: 100%;
	//overflow: hidden;
	overscroll-behavior: none;
`

const Background = styled.div`
	background-color: #4d6947;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: -5;
`

export default Game
