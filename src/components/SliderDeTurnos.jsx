// src/components/SPATurnos.jsx
import { useEffect, useState } from "react";
import "./SliderDeTurnos.css";

const SPATurnos = () => {
	const API = "http://localhost:3000";
	const [turnos, setTurnos] = useState([]);
	const [sucursales, setSucursales] = useState([]);
	const [clientes, setClientes] = useState([]);
	const [empleados, setEmpleados] = useState([]);
	const [servicios, setServicios] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modo, setModo] = useState("tabla");
	const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
	const [formData, setFormData] = useState({});

	const cargarTurnos = () => {
		fetch(`${API}/turnos/compl`)
			.then((res) => res.json())
			.then((data) => {
				setTurnos(data);
				setLoading(false);
				setModo("tabla");
				setTurnoSeleccionado(null);
			})
			.catch((error) => {
				console.error("Error al cargar turnos:", error);
				setLoading(false);
			});
	};

	const cargarSucursales = () => {
		fetch(`${API}/sucursal`)
			.then((res) => res.json())
			.then((data) => setSucursales(data))
			.catch((err) => console.error("Error al cargar sucursales:", err));
	};

	const cargarClientes = () => {
		fetch(`${API}/usuarios`)
			.then((res) => res.json())
			.then((data) => {
				const soloClientes = data.filter(
					(u) => u.tipo_usuario === "cliente"
				);
				setClientes(soloClientes);
			})
			.catch((err) => console.error("Error al cargar clientes:", err));
	};

	const cargarEmpleados = () => {
		fetch(`${API}/usuarios`)
			.then((res) => res.json())
			.then((data) => {
				const soloEmpleados = data.filter(
					(u) => u.tipo_usuario === "empleado"
				);
				setEmpleados(soloEmpleados);
			})
			.catch((err) => console.error("Error al cargar empleados:", err));
	};

	const cargarServicios = () => {
		fetch(`${API}/servicios`)
			.then((res) => res.json())
			.then((data) => setServicios(data))
			.catch((err) => console.error("Error al cargar servicios:", err));
	};

	useEffect(() => {
		cargarTurnos();
		cargarSucursales();
		cargarClientes();
		cargarEmpleados();
		cargarServicios();
	}, []);

	const handleEditar = (turno) => {
		const cliente = clientes.find((c) => c.nombre === turno.nombre_cliente);
		const empleado = empleados.find(
			(e) => e.nombre === turno.nombre_empleado
		);
		const servicio = servicios.find(
			(s) => s.nombre === turno.nombre_servicio
		);
		const sucursal = sucursales.find(
			(s) => s.nombre_sucursal === turno.nombre_sucursal
		);

		const turnoCompleto = {
			id_turno: turno.id_turno,
			id_sucursal: sucursal?.id_sucursal || "",
			id_cliente: cliente?.id_usuario || "",
			id_empleado: empleado?.id_usuario || "",
			id_servicio: servicio?.id_servicio || "",
			fecha_turno: turno.fecha_turno?.slice(0, 10) || "",
			hora_turno: turno.hora_turno?.slice(0, 5) || "",
			estado: turno.estado || "pendiente",
			observaciones: turno.observaciones || "",
		};

		setFormData(turnoCompleto);
		setTurnoSeleccionado(turno.id_turno);
		setModo("editar");
	};

	const handleEliminar = async () => {
		const confirmar = window.confirm(
			"¿Estás seguro que querés eliminar este turno?"
		);
		if (!confirmar) return;

		try {
			const resp = await fetch(`${API}/turnos/${turnoSeleccionado}`, {
				method: "DELETE",
			});
			if (resp.status === 204) {
				alert("✅ Turno eliminado con éxito");
				cargarTurnos();
			}
		} catch (err) {
			console.error("Fetch error:", err);
			alert("❌ Error al intentar eliminar el turno.");
		}
	};

	const handleGuardar = async () => {
		const metodo = modo === "editar" ? "PUT" : "POST";
		const url =
			modo === "editar"
				? `${API}/turnos/${turnoSeleccionado}`
				: `${API}/turnos`;
		const { observaciones, ...payloadSinObs } = formData;
		const payload = {
			...payloadSinObs,
			estado:
				modo === "nuevo" ? "pendiente" : formData.estado || "pendiente",
			observaciones: observaciones || "",
		};

		console.log("Payload a enviar:", payload);

		try {
			const resp = await fetch(url, {
				method: metodo,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (resp.ok) {
				const json = await resp.json();
				alert(
					`✅ Turno ${
						modo === "editar"
							? "modificado"
							: `creado con ID ${json.id_turno}`
					}`
				);
				cargarTurnos();
			} else {
				const err = await resp.json();
				alert(`❌ ${err.error || "Fallo al guardar los cambios"}`);
			}
		} catch (err) {
			console.error("Fetch error:", err);
			alert("❌ Error de conexión con el servidor.");
		}
	};

	const handleCancelar = () => {
		setFormData({});
		setTurnoSeleccionado(null);
		setModo("tabla");
	};

	const handleNuevo = () => {
		setFormData({});
		setModo("nuevo");
	};

	const fechaActual = new Date().toLocaleDateString();

	return (
		<div className="spa-contenedor">
			<h4>{fechaActual}</h4>
			<h1>Peluqueria Pelos House</h1>
			<p>Consola de toma de pedidos.</p>

			{modo === "tabla" && (
				<>
					{loading ? (
						<p>Cargando turnos...</p>
					) : (
						<table className="tabla-turnos">
							<thead>
								<tr>
									<th></th>
									<th>Sucursal</th>
									<th>Cliente</th>
									<th>Empleado</th>
									<th>Servicio</th>
									<th>Fecha</th>
									<th>Hora</th>
									<th>Estado</th>
									<th>Observaciones</th>
								</tr>
							</thead>
							<tbody>
								{turnos.map((t) => (
									<tr key={t.id_turno}>
										<td>
											<input
												type="checkbox"
												onChange={() => handleEditar(t)}
												checked={
													turnoSeleccionado ===
													t.id_turno
												}
											/>
										</td>
										<td>{t.nombre_sucursal}</td>
										<td>{t.nombre_cliente}</td>
										<td>{t.nombre_empleado}</td>
										<td>{t.nombre_servicio}</td>
										<td>
											{new Date(
												t.fecha_turno
											).toLocaleDateString("es-AR", {
												day: "2-digit",
												month: "2-digit",
												year: "numeric",
											})}
										</td>

										<td>{t.hora_turno}</td>
										<td>{t.estado}</td>
										<td
											className="celda-observaciones"
											title={t.observaciones}
										>
											{t.observaciones}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
					<button className="boton-nuevo" onClick={handleNuevo}>
						Nuevo Turno
					</button>
				</>
			)}

			{(modo === "nuevo" || modo === "editar") && (
				<div className="formulario-turno">
					<h3>
						{modo === "editar" ? "Editar Turno" : "Nuevo Turno"}
					</h3>
					<form>
						<select
							value={formData.id_sucursal || ""}
							onChange={(e) =>
								setFormData({
									...formData,
									id_sucursal: parseInt(e.target.value),
								})
							}
						>
							<option value="">Seleccione una sucursal</option>
							{sucursales.map((suc) => (
								<option
									key={suc.id_sucursal}
									value={suc.id_sucursal}
								>
									{suc.nombre_sucursal}
								</option>
							))}
						</select>
						<select
							value={formData.id_cliente || ""}
							onChange={(e) =>
								setFormData({
									...formData,
									id_cliente: parseInt(e.target.value),
								})
							}
						>
							<option value="">Seleccione un cliente</option>
							{clientes.map((cli) => (
								<option
									key={cli.id_usuario}
									value={cli.id_usuario}
								>
									{cli.nombre}
								</option>
							))}
						</select>
						<select
							value={formData.id_empleado || ""}
							onChange={(e) =>
								setFormData({
									...formData,
									id_empleado: parseInt(e.target.value),
								})
							}
						>
							<option value="">Seleccione un empleado</option>
							{empleados.map((emp) => (
								<option
									key={emp.id_usuario}
									value={emp.id_usuario}
								>
									{emp.nombre}
								</option>
							))}
						</select>
						<select
							value={formData.id_servicio || ""}
							onChange={(e) =>
								setFormData({
									...formData,
									id_servicio: parseInt(e.target.value),
								})
							}
						>
							<option value="">Seleccione un servicio</option>
							{servicios.map((srv) => (
								<option
									key={srv.id_servicio}
									value={srv.id_servicio}
								>
									{srv.nombre}
								</option>
							))}
						</select>
						<input
							type="date"
							value={formData.fecha_turno || ""}
							onChange={(e) =>
								setFormData({
									...formData,
									fecha_turno: e.target.value,
								})
							}
						/>
						<input
							type="time"
							value={formData.hora_turno || ""}
							onChange={(e) =>
								setFormData({
									...formData,
									hora_turno: e.target.value,
								})
							}
						/>

						<select
							value={formData.estado || ""}
							onChange={(e) =>
								setFormData({
									...formData,
									estado: e.target.value,
								})
							}
						>
							<option value="pendiente">Pendiente</option>
							<option value="confirmado">Confirmado</option>
							<option value="cancelado">Cancelado</option>
						</select>

						<textarea
							placeholder="Observaciones"
							value={formData.observaciones || ""}
							onChange={(e) =>
								setFormData({
									...formData,
									observaciones: e.target.value,
								})
							}
						/>
					</form>
					<div className="botonera-formulario">
						<button onClick={handleGuardar}>Guardar Cambios</button>
						{modo === "editar" && (
							<button onClick={handleEliminar}>
								Eliminar Turno
							</button>
						)}
						<button onClick={handleCancelar}>Cancelar</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default SPATurnos;
