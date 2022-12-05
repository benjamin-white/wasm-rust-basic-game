extern crate console_error_panic_hook;
use wasm_bindgen::prelude::*;
use math::round;

cfg_if::cfg_if! {
    if #[cfg(feature = "wee_alloc")] {
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}

// 'wasm-utils' is aliased in Vite to workaround no relative imports
#[wasm_bindgen(module="wasm-utils/date.ts")]
extern {
  fn now() -> usize;
}

#[derive(PartialEq, Clone, Copy)]
pub struct PlayerCell(usize);

struct Player {
    body: Vec<PlayerCell>,
    direction: Direction
}

impl Player {
    fn new(initial_index: usize, length: usize) -> Player {
        let mut body = vec!();

        for i in 0..length {
            body.push(PlayerCell(initial_index - i))
        }

        Player {
            body,
            direction: Direction::East
        }
    }
}

#[wasm_bindgen]
#[derive(PartialEq)]
pub enum Direction {
    North,
    East,
    South,
    West,
}

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum GameStatus {
    Won,
    Lost,
    Playing,
}

#[wasm_bindgen]
pub struct World {
    width: usize,
    size: usize,
    player: Player,
    next_cell: Option<PlayerCell>,
    reward_cell: Option<usize>,
    state: Option<GameStatus>,
    points: usize,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize) -> World {
        let size = width * width;
        let player = Player::new(round::ceil(size as f64 / 2.0, 0) as usize, 4);

        World {
            width,
            size,
            reward_cell: World::create_reward_cell(size, &player.body),
            player,
            next_cell: None,
            state: None,
            points: 0,
        }
    }

    pub fn start_game(&mut self) {
        self.state = Some(GameStatus::Playing)
    }

    pub fn get_game_status(&self) -> Option<GameStatus> {
        self.state
    }

    pub fn get_status_text(&self) -> String {
        match self.state {
            Some(GameStatus::Won) => String::from("Winner!"),
            Some(GameStatus::Lost) => String::from("Loser!"),
            Some(GameStatus::Playing) => String::from("Playing..."),
            None => String::from("Click 'Play' to play..."),
        }
    }

    pub fn get_points(&self) -> usize {
        self.points
    }

    fn create_reward_cell(grid_size: usize, player_body: &Vec<PlayerCell>) -> Option<usize> {
        let mut reward_cell;

        loop {
            reward_cell = now() % grid_size;
            if !player_body.contains(&PlayerCell(reward_cell)) { break; }
        }

        Some(reward_cell)
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn get_reward_cell(&self) -> Option<usize> {
        self.reward_cell
    }

    pub fn player_index(&self) -> usize {
        self.player.body[0].0
    }

    pub fn request_location_update(&mut self, direction: Direction) {
        let next_cell = self.generate_next_cell(&direction);
        if self.player.body[1].0 == next_cell.0 { return; }
        self.next_cell = Some(next_cell);
        self.player.direction = direction;
    }

    pub fn update_player_location(&mut self) {

        match self.state {
            Some(GameStatus::Playing) => {
                let temp = self.player.body.clone();

                match self.next_cell {
                    Some(cell) => {
                        self.player.body[0] = cell;
                        self.next_cell = None;
                    }
                    None => {
                        self.player.body[0] = self.generate_next_cell(&self.player.direction);
                    }
                }
        
                for i in 1..self.player_length() {
                    self.player.body[i] = PlayerCell(temp[i - 1].0);
                }

                if self.player.body[1..self.player_length()].contains(&self.player.body[0]) {
                  self.state = Some(GameStatus::Lost)
                }
        
                if self.reward_cell == Some(self.player.body[0].0) {
                    if self.player_length() < self.size {
                        self.points += 1;
                        self.reward_cell = World::create_reward_cell(self.size, &self.player.body);
                    } else {
                        self.reward_cell = None;
                        self.state = Some(GameStatus::Won)
                    }
        
                    self.player.body.push(PlayerCell(self.player.body[1].0));
                }
            },
            _ => {}
        }
    }

    pub fn player_length(&self) -> usize {
        self.player.body.len()
    }

    pub fn trail_cells(&self) -> *const PlayerCell {
        self.player.body.as_ptr()
    }

    fn generate_next_cell(&self, direction: &Direction) -> PlayerCell {
        let current_position = self.player_index();
        let row = current_position / self.width;

        return match direction {
            Direction::North => {
                let threshold = current_position - row * self.width;
                if current_position == threshold {
                    PlayerCell(self.size - self.width + threshold)
                } else {
                    PlayerCell(current_position - self.width)
                }
            }
            Direction::East => {
                let threshold = (row + 1) * self.width;
                if current_position + 1 == threshold {
                    PlayerCell(threshold - self.width)
                } else {
                    PlayerCell(current_position + 1)
                }
            }
            Direction::South => {
                let threshold = current_position + (self.width - row) * self.width;
                if current_position + self.width == threshold {
                    PlayerCell(threshold - (row + 1) * self.width)
                } else {
                    PlayerCell(current_position + self.width)
                }
            }
            Direction::West => {
                let threshold = row * self.width;
                if current_position == threshold {
                    PlayerCell(threshold + self.width - 1)
                } else {
                    PlayerCell(current_position - 1)
                }
            }
        }
    }
}
