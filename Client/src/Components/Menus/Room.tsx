import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionState } from '@microsoft/signalr'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { IGameState } from '../../Interfaces/IGameState'
import Game from '../../Components/Game'
import TestData from '../../Assets/TestData.js'
import Lobby from './Lobby'
import Popup from './Popup'

interface Props {
	onGameStarted: () => void
}

const testing: boolean = false
const Room = ({ onGameStarted }: Props) => {
	let urlParams = useParams()
	let navigate = useNavigate()
	const [connection, setConnection] = useState<HubConnection>()
	const [roomId, setRoomId] = useState<string | undefined>(urlParams.roomId)
	const [gameState, setGameState] = useState<IGameState>(testing ? JSON.parse(TestData) : undefined) // Local debugging

	// const [rawGameStateHistory, setRawGameStateHistory] = useState<any[]>([])

	useEffect(() => {
		// Builds the SignalR connection, mapping it to /server
		let signalRConnection = new signalR.HubConnectionBuilder()
			.withUrl(`http://${window.location.hostname}:5169/server`)
			.withAutomaticReconnect()
			.configureLogging(signalR.LogLevel.Information)
			.build()

		signalRConnection?.start().then(() => {
			setConnection(signalRConnection)
			JoinRoom()
		})
	}, [])

	useEffect(() => {
		if (connection?.state !== HubConnectionState.Connected) return
		connection.on('UpdateGameState', UpdateGameState)

		return () => {
			connection.off('UpdateGameState', UpdateGameState)
		}
	}, [connection])

	useEffect(() => {
		console.log(urlParams.roomId)
		setRoomId(urlParams.roomId)
		if (connection?.state == HubConnectionState.Connected) {
			JoinRoom()
		}
	}, [urlParams.roomId, connection])

	const JoinRoom = () => {
		if (!roomId) return
		connection?.invoke('JoinRoom', roomId)
	}

	const UpdateGameState = (data: any) => {
		let parsedData: IGameState = JSON.parse(data)



		if (!gameState) {
			onGameStarted()
		}

		// rawGameStateHistory.push(data)
		// setRawGameStateHistory(rawGameStateHistory)
		// console.log(JSON.stringify(rawGameStateHistory))

		setGameState({ ...parsedData })
	}

	return gameState!! ? (
		<>
			<Game
				connection={connection}
				connectionId={testing ? 'CUqUsFYm1zVoW-WcGr6sUQ' : connection?.connectionId}
				gameState={gameState}
			/>
			{!!gameState.WinnerId && (
				<Popup onHomeButton={() => navigate('/')}>
					<h3>Winner is {gameState.Players.find((p) => p.Id === gameState.WinnerId)?.Name}</h3>
				</Popup>
			)}
		</>
	) : (
		<Lobby roomId={roomId} connection={connection} />
	)
}

export default Room
